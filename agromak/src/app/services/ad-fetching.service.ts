import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from "@angular/fire/compat/firestore";
import {AuthService} from "./auth.service";
import {Ad} from "../shared/models/ad";
import {BehaviorSubject, map, take, tap} from "rxjs";
import {User} from "../shared/models/user";
import {documentId} from "@angular/fire/firestore";
import {ApiService} from "./api.service";
import {AdFetchType} from "../shared/ad-fetch-type.enum";
import {AdListAdditionalData} from "../shared/models/ad-list-additional-data";


export const AD_PAGE_SIZE = 20;

@Injectable({
  providedIn: 'root'
})
export class AdFetchingService {
  private adsSubject = new BehaviorSubject<Ad[]>([]);
  private myAdsSubject = new BehaviorSubject<Ad[]>([]);
  private favoriteAdsSubject = new BehaviorSubject<Ad[]>([]);
  private searchedAdsSubject = new BehaviorSubject<Ad[]>([]);
  private similarAdsSubject = new BehaviorSubject<Ad[]>([]);

  ads$ = this.adsSubject.asObservable();
  myAds$ = this.myAdsSubject.asObservable();
  favoriteAds$ = this.favoriteAdsSubject.asObservable();
  searchedAds$ = this.searchedAdsSubject.asObservable();
  similarAds$ = this.similarAdsSubject.asObservable();

  user!: User;

  constructor(private angularFirestore: AngularFirestore,
              private authService: AuthService,
              private apiService: ApiService,
  ) {

    this.authService.user$.subscribe(user => {
      this.user = user;
    })
  }


  fetchAds(type: AdFetchType, params: AdListAdditionalData) {
    let query: AngularFirestoreCollection<any> | undefined;

    if (type === AdFetchType.ALL) {
      query = this.getAllAdsQuery(params);
    } else if (type === AdFetchType.SEARCHED) {
      query = this.getSearchedAdsQuery(params);
    } else if (type === AdFetchType.MY_ADS) {
      query = this.getMyAdsQuery(params);
    } else if (type === AdFetchType.FAVORITE) {
      query = this.getFavoriteAdsQuery(params);
    } else if (type === AdFetchType.SIMILAR) {
      query = this.getSimilarAdsQuery(params?.similarAd!);
    }

    if (query !== undefined) {
      this.mapAndUpdateAds(query, type);
    }
  }

  private getAllAdsQuery(params: AdListAdditionalData): AngularFirestoreCollection<any> {
    const {searchValue, lastVisibleAd, order, similarAd} = params;

    if (lastVisibleAd) {
      return this.angularFirestore.collection('ads', ref =>
        ref.orderBy('uploadedAt', order)
          .limit(AD_PAGE_SIZE)
          .startAfter(params.lastVisibleAd!.uploadedAt)
      );
    } else {
      return this.angularFirestore.collection('ads', ref =>
        ref.orderBy('uploadedAt', order)
          .limit(AD_PAGE_SIZE)
      );
    }
  }

  private getSearchedAdsQuery(params: AdListAdditionalData): AngularFirestoreCollection<any> {
    const {searchValue, lastVisibleAd, order, similarAd} = params;
    const lowerCaseSearchValue = searchValue?.toLowerCase();
    if (lastVisibleAd) {
      return this.angularFirestore.collection('ads', ref =>
        ref.where('title_lowercase', '>=', lowerCaseSearchValue)
          .where('title_lowercase', '<=', lowerCaseSearchValue + '\uf8ff')
          .orderBy('uploadedAt', order)
          .limit(AD_PAGE_SIZE)
          .startAfter(lastVisibleAd.uploadedAt)
      );
    } else {
      return this.angularFirestore.collection('ads', ref =>
        ref.where('title_lowercase', '>=', lowerCaseSearchValue)
          .where('title_lowercase', '<=', lowerCaseSearchValue + '\uf8ff')
          .orderBy('uploadedAt', order)
          .limit(AD_PAGE_SIZE)
      );
    }
  }

  private getMyAdsQuery(params: AdListAdditionalData): AngularFirestoreCollection<any> {
    const {searchValue, lastVisibleAd, order, similarAd} = params;

    console.log('lastVisibleAd', lastVisibleAd)
    if (lastVisibleAd) {
      return this.angularFirestore.collection('ads', ref =>
        ref.where('ownerId', '==', this.user.uid)
          .orderBy('uploadedAt', order)
          .limit(AD_PAGE_SIZE)
          .startAfter(lastVisibleAd?.uploadedAt)
      );
    } else {
      return this.angularFirestore.collection('ads', ref =>
        ref.where('ownerId', '==', this.user.uid)
          .orderBy('uploadedAt', order)
          .limit(AD_PAGE_SIZE)
      );
    }
  }

  private getFavoriteAdsQuery(params: AdListAdditionalData): undefined | AngularFirestoreCollection<any> {
    const {searchValue, lastVisibleAd, order, similarAd} = params;

    if (!this.user.favoriteAds || this.user.favoriteAds.length === 0) {
      this.favoriteAdsSubject.next([]);
      return;
    }
    return this.angularFirestore.collection('ads', ref =>
      ref.where(documentId(), 'in', this.user.favoriteAds)
        .orderBy('uploadedAt', order)
    );
  }

  private getSimilarAdsQuery(similarAd: Ad): AngularFirestoreCollection<any> {
    return this.angularFirestore.collection('ads', ref =>
      ref.where('category', '==', similarAd.category)
    );
  }

  private mapAndUpdateAds(query: AngularFirestoreCollection<any>, type: AdFetchType) {
    query.snapshotChanges()
      .pipe(
        map(actions => actions.map(doc => this.mapQuery(doc))),
        tap(ads => {
          console.log(ads)
          if (ads.length === 0) {
            return;
          }
          this.updateSubjectBasedOnType(ads, type);
        }),
        take(1)
      ).subscribe();
  }

  private mapQuery(doc: DocumentChangeAction<any>) {
    const data: any = doc.payload.doc.data();
    const id = doc.payload.doc.id;
    return {id, ...data} as Ad;
  }

  private updateSubjectBasedOnType(ads: Ad[], type: AdFetchType) {
    switch (type) {
      case AdFetchType.ALL:
        this.adsSubject.next(this.adsSubject.value.concat(ads));
        break;
      case AdFetchType.SEARCHED:
        this.searchedAdsSubject.next(this.searchedAdsSubject.value.concat(ads));
        break;
      case AdFetchType.MY_ADS:
        this.myAdsSubject.next(this.myAdsSubject.value.concat(ads));
        break;
      case AdFetchType.FAVORITE:
        this.favoriteAdsSubject.next(this.favoriteAdsSubject.value.concat(ads));
        break;
      case AdFetchType.SIMILAR:
        this.similarAdsSubject.next(this.similarAdsSubject.value.concat(ads));
        break;
    }
  }


  clearAllAds() {
    this.adsSubject.next([]);
  }

  clearSearchedAds() {
    this.searchedAdsSubject.next([]);
  }

  clearMyAds() {
    this.myAdsSubject.next([]);
  }

  clearFavoriteAds() {
    this.favoriteAdsSubject.next([]);
  }
}

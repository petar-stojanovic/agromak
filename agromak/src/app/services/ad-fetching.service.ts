import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction
} from "@angular/fire/compat/firestore";
import {AuthService} from "./auth.service";
import {Ad} from "../shared/models/ad";
import {BehaviorSubject, map, take, tap} from "rxjs";
import {User} from "../shared/models/user";
import {doc, documentId, Firestore, updateDoc} from "@angular/fire/firestore";
import {ImageService} from "./image.service";
import firebase from "firebase/compat/app";
import {ApiService} from "./api.service";
import {AdFetchType} from "../shared/ad-fetch-type.enum";
import {AdListAdditionalData} from "../shared/models/ad-list-additional-data";
import FieldValue = firebase.firestore.FieldValue;


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
              private firestore: Firestore,
              private authService: AuthService,
              private imageService: ImageService,
              private apiService: ApiService,
  ) {

    this.authService.user$.subscribe(user => {
      this.user = user;
    })
  }


  fetchAds(type: AdFetchType, params?: AdListAdditionalData) {
    let query: AngularFirestoreCollection<any> | undefined;

    switch (type) {
      case AdFetchType.ALL:
        query = this.getAllAdsQuery(params?.lastVisibleAd);
        break;
      case AdFetchType.SEARCHED:
        query = this.getSearchedAdsQuery(params?.searchValue!, params?.lastVisibleAd);
        break;
      case AdFetchType.MY_ADS:
        query = this.getMyAdsQuery(params?.lastVisibleAd, params?.order);
        break;
      case AdFetchType.FAVORITE:
        query = this.getFavoriteAdsQuery();
        break;
      case AdFetchType.SIMILAR:
        query = this.getSimilarAdsQuery(params?.similarAd!);
        break;
      default:
        return;
    }
    if (query !== undefined) {
      this.mapAndUpdateAds(query, type);
    }
  }

  private getAllAdsQuery(lastVisible?: Ad): AngularFirestoreCollection<any> {
    if (!lastVisible) {
      return this.angularFirestore.collection('ads', ref =>
        ref.orderBy('uploadedAt', 'asc')
          .limit(AD_PAGE_SIZE)
      );
    } else {
      return this.angularFirestore.collection('ads', ref =>
        ref.orderBy('uploadedAt', 'asc')
          .limit(AD_PAGE_SIZE)
          .startAfter(lastVisible.uploadedAt)
      );
    }
  }

  private getSearchedAdsQuery(searchValue: string, lastVisibleAd: Ad | undefined): AngularFirestoreCollection<any> {
    const lowerCaseSearchValue = searchValue.toLowerCase();
    if (!lastVisibleAd) {
      return this.angularFirestore.collection('ads', ref =>
        ref.where('title_lowercase', '>=', lowerCaseSearchValue)
          .where('title_lowercase', '<=', lowerCaseSearchValue + '\uf8ff')
          .orderBy('uploadedAt', 'asc')
          .limit(AD_PAGE_SIZE)
      );
    } else {
      return this.angularFirestore.collection('ads', ref =>
        ref.where('title_lowercase', '>=', lowerCaseSearchValue)
          .where('title_lowercase', '<=', lowerCaseSearchValue + '\uf8ff')
          .orderBy('uploadedAt', 'asc')
          .limit(AD_PAGE_SIZE)
          .startAfter(lastVisibleAd.uploadedAt)
      );
    }
  }

  private getMyAdsQuery(lastVisibleAd: Ad | undefined, order: 'asc' | 'desc' | undefined): AngularFirestoreCollection<any> {
    console.log('lastVisibleAd', lastVisibleAd)
    if (!lastVisibleAd) {
      return this.angularFirestore.collection('ads', ref =>
        ref.where('ownerId', '==', this.user.uid)
          .orderBy('uploadedAt', order || 'desc')
          .limit(AD_PAGE_SIZE)
      );
    } else {
      return this.angularFirestore.collection('ads', ref =>
        ref.where('ownerId', '==', this.user.uid)
          .orderBy('uploadedAt', order || 'desc')
          .limit(AD_PAGE_SIZE)
          .startAfter(lastVisibleAd?.uploadedAt)
      );
    }
  }

  private getFavoriteAdsQuery(): undefined | AngularFirestoreCollection<any> {
    if (!this.user.favoriteAds || this.user.favoriteAds.length === 0) {
      this.favoriteAdsSubject.next([]);
      return;
    }
    return this.angularFirestore.collection('ads', ref =>
      ref.where(documentId(), 'in', this.user.favoriteAds)
    );
  }

  private getSimilarAdsQuery(similarAd: Ad): AngularFirestoreCollection<any> {
    return this.angularFirestore.collection('ads', ref =>
      ref.where('category', '==', similarAd.category) // Example, adjust as needed
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

  async toggleFavoriteAd(adId: string) {
    const userRef: AngularFirestoreDocument<User> = this.angularFirestore.doc(`users/${this.user.uid}`);
    let favoriteAds = this.user.favoriteAds;
    const adIndex = favoriteAds.indexOf(adId);

    if (adIndex > -1) {
      favoriteAds.splice(adIndex, 1);
    } else {
      favoriteAds.push(adId);
    }

    const data = {
      ...this.user,
      favoriteAds: favoriteAds,
    }
    await userRef.set(data, {merge: true});

    this.fetchAds(AdFetchType.FAVORITE);
  }

  private mapQuery(doc: DocumentChangeAction<any>) {
    const data: any = doc.payload.doc.data();
    const id = doc.payload.doc.id;
    return {id, ...data} as Ad;
  }

  async incrementViewCount(id: string) {
    const adDocRef = doc(this.firestore, `ads/${id}`);
    return await updateDoc(adDocRef, {
      viewCount: FieldValue.increment(1)
    });
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
}

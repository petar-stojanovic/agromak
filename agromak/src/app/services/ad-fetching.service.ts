import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "./auth.service";
import {Ad} from "../shared/models/ad";
import {BehaviorSubject, first, map, Observable, of, switchMap, take, tap} from "rxjs";
import {User} from "../shared/models/user";
import {documentId} from "@angular/fire/firestore";
import {ApiService} from "./api.service";
import {AdFetchType} from "../shared/ad-fetch-type.enum";
import {AdListAdditionalData} from "../shared/models/ad-list-additional-data";
import firebase from "firebase/compat/app";
import CollectionReference = firebase.firestore.CollectionReference;


export const AD_PAGE_SIZE = 15;

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


  fetchAds(type: AdFetchType, params: AdListAdditionalData): Observable<boolean> {

    return this.authService.user$.pipe(
      first(),
      switchMap(user => {
        if (!user) {
          return of(true);
        }
        this.user = user;

        let query$: Observable<Ad[]> | undefined;

        if (type === AdFetchType.ALL) {
          query$ = this.getAllAdsQuery(params)
        } else if (type === AdFetchType.SEARCHED) {
          query$ = this.getSearchedAdsQuery(params);
        } else if (type === AdFetchType.MY_ADS) {
          query$ = this.getMyAdsQuery(params);
        } else if (type === AdFetchType.FAVORITE) {
          query$ = this.getFavoriteAdsQuery(params);
        } else if (type === AdFetchType.SIMILAR) {
          query$ = this.getSimilarAdsQuery(params);
        }

        if (!query$) {
          return of(true);
        }

        return query$.pipe(
          take(1),
          tap(ads => this.updateSubjectBasedOnType(ads, type)),
          map(ads => ads.length === 0)
        );
      })
    )
  }

  private getAllAdsQuery(params: AdListAdditionalData): Observable<Ad[]> {
    const {searchValue, lastVisibleAd, order, similarAd} = params;

    console.log(lastVisibleAd);
    return this.apiService
      .docDataQuery(`usersSearchHistory/${this.user.uid}`)
      .pipe(
        take(1),
        switchMap((userSearchHistory: { id: string, searchHistory: string[] }) => {
          const userSearches = userSearchHistory.searchHistory;
          console.log(userSearches);

          return userSearches.length > 2
            ? this.searchAdsBasedOnUserSearchedHistory(lastVisibleAd, userSearches, order)
            : this.searchAllAds(lastVisibleAd, order);
        })
      )
  }

  private searchAdsBasedOnUserSearchedHistory(lastVisibleAd: Ad | undefined, userSearches: string[], order: "asc" | "desc") {
    return this.queryAdsCollection(ref =>
      ref.where('keywords', 'array-contains-any', userSearches)
        .orderBy('uploadedAt', order), lastVisibleAd);
  }

  private searchAllAds(lastVisibleAd: Ad | undefined, order: "asc" | "desc") {
    return this.queryAdsCollection(ref => ref.orderBy('uploadedAt', order), lastVisibleAd);
  }

  private getSearchedAdsQuery(params: AdListAdditionalData): Observable<Ad[]> {
    const {searchValue, lastVisibleAd, order} = params;
    const keywords = this.extractKeywords(searchValue!);
    return this.queryAdsCollection(ref =>
      ref.where('keywords', 'array-contains-any', keywords)
        .orderBy('uploadedAt', order), lastVisibleAd);
  }

  private getMyAdsQuery(params: AdListAdditionalData): Observable<Ad[]> {
    const {lastVisibleAd, order} = params;
    return this.queryAdsCollection(ref =>
      ref.where('ownerId', '==', this.user.uid)
        .orderBy('uploadedAt', order), lastVisibleAd);
  }

  private getFavoriteAdsQuery(params: AdListAdditionalData): undefined | Observable<Ad[]> {
    const {searchValue, lastVisibleAd, order, similarAd} = params;

    if (!this.user.favoriteAds || this.user.favoriteAds.length === 0) {
      this.favoriteAdsSubject.next([]);
      return;
    }
    return this.angularFirestore.collection<Ad>('ads', ref =>
      ref.where(documentId(), 'in', this.user.favoriteAds)
        .orderBy('uploadedAt', order)
    ).valueChanges({idField: 'id'});
  }

  private getSimilarAdsQuery(params: AdListAdditionalData): undefined | Observable<Ad[]> {
    const {lastVisibleAd, order, similarAd} = params;
    if (!similarAd) {
      return undefined;
    }
    return this.queryAdsCollection(ref =>
      ref.where('category', '==', similarAd.category)
        .orderBy('uploadedAt', order), lastVisibleAd);
  }

  private queryAdsCollection(queryFn: (ref: CollectionReference<firebase.firestore.DocumentData>) => any, lastVisibleAd?: Ad): Observable<Ad[]> {
    return this.angularFirestore.collection<Ad>('ads', ref => {
      let query = queryFn(ref);
      if (lastVisibleAd) query = query.startAfter(lastVisibleAd.uploadedAt);
      return query.limit(AD_PAGE_SIZE);
    })
      .valueChanges({idField: 'id'});
  }


  private updateSubjectBasedOnType(ads: Ad[], type: AdFetchType) {
    console.log(ads);
    if (ads.length === 0 || ads.length === 1 && type === AdFetchType.SIMILAR) {
      return;
    }

    if (type === AdFetchType.ALL) {
      this.adsSubject.next(this.adsSubject.value.concat(ads));
    } else if (type === AdFetchType.SEARCHED) {
      this.searchedAdsSubject.next(this.searchedAdsSubject.value.concat(ads));
    } else if (type === AdFetchType.MY_ADS) {
      this.myAdsSubject.next(this.myAdsSubject.value.concat(ads));
    } else if (type === AdFetchType.FAVORITE) {
      this.favoriteAdsSubject.next(ads);
    } else if (type === AdFetchType.SIMILAR) {
      this.similarAdsSubject.next(this.similarAdsSubject.value.concat(ads));
    }
  }


  clearAds(type: AdFetchType) {
    if (type === AdFetchType.ALL) {
      this.adsSubject.next([]);
    } else if (type === AdFetchType.SEARCHED) {
      this.searchedAdsSubject.next([]);
    } else if (type === AdFetchType.MY_ADS) {
      this.myAdsSubject.next([]);
    } else if (type === AdFetchType.FAVORITE) {
      this.favoriteAdsSubject.next([]);
    } else if (type === AdFetchType.SIMILAR) {
      this.similarAdsSubject.next([]);
    }
  }

  private extractKeywords(text: string): string[] {
    return text
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 2);
  }
}

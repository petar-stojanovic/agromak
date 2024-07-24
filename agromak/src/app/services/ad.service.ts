import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction
} from "@angular/fire/compat/firestore";
import {Auth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {GalleryPhoto} from "@capacitor/camera";
import {CreateAd} from "../shared/models/create-ad";
import {AuthService} from "./auth.service";
import {Ad} from "../shared/models/ad";
import {BehaviorSubject, map, Observable, of, take, tap} from "rxjs";
import {User} from "../shared/models/user";
import {documentId} from "@angular/fire/firestore";
import {CreateDynamicAd} from "../shared/models/create-dynamic-ad-";
import {ImageService} from "./image.service";

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private ads = new BehaviorSubject<Ad[]>([]);
  private searchedAds = new BehaviorSubject<Ad[]>([]);
  private myAds = new BehaviorSubject<Ad[]>([]);
  private favoriteAds = new BehaviorSubject<Ad[]>([]);

  readonly NUM_OF_STARTING_ADS = 10;
  readonly NUM_OF_ADS_TO_LOAD = 5;

  ads$: Observable<Ad[]>;
  searchedAds$: Observable<Ad[]>;
  myAds$: Observable<Ad[]>;
  favoriteAds$: Observable<Ad[]>;

  user: User | null = null;

  constructor(private angularFirestore: AngularFirestore,
              private auth: Auth,
              private authService: AuthService,
              private imageService: ImageService,
              private router: Router) {

    this.ads$ = this.ads.asObservable();
    this.searchedAds$ = this.searchedAds.asObservable();
    this.myAds$ = this.myAds.asObservable();
    this.favoriteAds$ = this.favoriteAds.asObservable();

    this.authService.user$.subscribe(user => {
      this.user = user;
    })
  }

  async createAd(value: CreateAd, images?: GalleryPhoto[]) {
    if (!this.user) {
      await this.router.navigate(['/login']);
    }

    const data = {
      ...value,
      title_lowercase: value.title.toLowerCase(),
      category: value.category,
      subcategory: value.subcategory,
      ownerId: this.user!.uid,
      ownerName: this.user!.displayName,
      uploadedAt: new Date(),
      images: []
    };

    const adRef = await this.angularFirestore.collection('ads').add(data);

    return adRef.id;
  }

  async createDynamicAd(dynamicAd: CreateDynamicAd) {
    if (!this.user) {
      await this.router.navigate(['/login']);
    }

    const data = {
      ...dynamicAd,
      title_lowercase: dynamicAd.title.toLowerCase(),
      ownerId: this.user!.uid,
      ownerName: this.user!.displayName,
      uploadedAt: new Date(),
    };

    const adRef = await this.angularFirestore.collection('ads').add(data);

    if (dynamicAd.images) {
      return await this.imageService.uploadAdImages(adRef.id, dynamicAd.images);
    }

    return;
  }


  getAds(lastVisible?: Ad) {
    let query;
    if (!lastVisible) {
      query = this.angularFirestore
        .collection('ads', ref => ref
          .orderBy(documentId(), 'asc')
          .limit(this.NUM_OF_STARTING_ADS)
        );
    } else {
      query = this.angularFirestore
        .collection('ads', ref => ref
          .orderBy(documentId(), 'asc')
          .limit(this.NUM_OF_ADS_TO_LOAD)
          .startAfter(lastVisible.id)
        );
    }

    this.mapAndUpdate(query);
  }

  searchAds(searchValue: string) {
    const lowerCaseSearchValue = searchValue.toLowerCase();
    const query = this.angularFirestore
      .collection('ads', ref => ref
        .where('title_lowercase', '>=', lowerCaseSearchValue)
        .where('title_lowercase', '<=', lowerCaseSearchValue + '\uf8ff')
        .limit(this.NUM_OF_STARTING_ADS)
      );

    this.mapAndUpdate(query, true);
  }


  getAdById(id: string) {
    return this.angularFirestore
      .doc(`ads/${id}`)
      .get()
      .pipe(
        map(doc => {
          const data: any = doc.data();
          const id = doc.id;
          return {id, ...data} as Ad;
        })
      );
  }

  resetAds() {
    this.ads.next([]);
    this.searchedAds.next([]);
    this.getAds();
  }

  private mapAndUpdate(col: AngularFirestoreCollection<any>, isSearch = false) {

    col.snapshotChanges().pipe(
      map(actions => actions.map(doc => this.mapQuery(doc))),
      tap(ads => {
        const currentAds = this.ads.getValue();
        if (isSearch) {
          this.searchedAds.next(ads);
        } else {
          this.ads.next([...currentAds, ...ads]);
        }
      }),
      take(1)
    ).subscribe();
  }

  async toggleFavoriteAd(adId: string) {
    if (!this.user) {
      await this.router.navigate(['/login']);
    }

    const userRef: AngularFirestoreDocument<User> = this.angularFirestore.doc(`users/${this.user!.uid}`);
    let favoriteAds = this.user!.favoriteAds;
    const adIndex = favoriteAds.indexOf(adId);

    if (adIndex > -1) {
      favoriteAds.splice(adIndex, 1);
    } else {
      favoriteAds.push(adId);
    }

    const data = {
      ...this.user!,
      favoriteAds: favoriteAds,
    }
    await userRef.set(data, {merge: true});

    this.updateFavoriteAds();
  }

  updateFavoriteAds() {
    if (!this.user || this.user.favoriteAds.length === 0) {
      return;
    }

    this.angularFirestore
      .collection('ads', ref => ref.where(documentId(), 'in', this.user!.favoriteAds))
      .snapshotChanges()
      .pipe(
        map((query) => {
          return query.map(doc => this.mapQuery(doc))
        })
      ).subscribe(ads => {
      this.favoriteAds.next(ads);
    });
  }

  fetchMyAds() {
    if (!this.user) {
      return of([] as Ad[]);
    }

    return this.angularFirestore
      .collection('ads', ref => ref.where('ownerId', '==', this.user!.uid))
      .snapshotChanges()
      .pipe(
        map((query) => {
          return query.map(doc => this.mapQuery(doc))
        }),
        tap((ads) => {
          this.myAds.next(ads);
        })
      )
  }

  private mapQuery(doc: DocumentChangeAction<any>) {
    const data: any = doc.payload.doc.data();
    const id = doc.payload.doc.id;
    return {id, ...data} as Ad;
  }

}

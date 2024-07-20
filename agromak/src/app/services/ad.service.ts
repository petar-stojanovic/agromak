import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Auth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {GalleryPhoto} from "@capacitor/camera";
import {CreateAd} from "../shared/models/create-ad";
import {AuthService} from "./auth.service";
import {Ad} from "../shared/models/ad";
import {BehaviorSubject, map, Observable, take} from "rxjs";
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

  readonly NUM_OF_STARTING_ADS = 10;
  readonly NUM_OF_ADS_TO_LOAD = 5;

  ads$: Observable<Ad[]>;
  searchedAds$: Observable<Ad[]>;


  user: User | null = null;


  constructor(private angularFirestore: AngularFirestore,
              private auth: Auth,
              private authService: AuthService,
              private imageService: ImageService,
              private router: Router) {

    this.ads$ = this.ads.asObservable();
    this.searchedAds$ = this.searchedAds.asObservable();

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
    return this.angularFirestore.doc(`ads/${id}`).get();
  }

  resetAds() {
    this.ads.next([]);
    this.searchedAds.next([]);
    this.getAds();
  }

  private mapAndUpdate(col: AngularFirestoreCollection<any>, searched = false) {

    return col.snapshotChanges()
      .pipe(
        map((actions) => {
          const values = actions.map(it => {
            const data = it.payload.doc.data();
            const id = it.payload.doc.id;
            return {id, ...data} as Ad;
          })

          const currentAds = this.ads.getValue();

          if (searched) {
            this.searchedAds.next([...values]);
          } else {
            this.ads.next([...currentAds, ...values]);
          }

          return actions;
        }),
        take(1)
      )
      .subscribe()
  }
}

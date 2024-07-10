import {inject, Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Auth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {GalleryPhoto} from "@capacitor/camera";
import {CreateAd} from "../shared/models/create-ad";
import {ImageService} from "./image.service";
import {AuthService} from "./auth.service";
import {Ad} from "../shared/models/ad";
import {BehaviorSubject, map, Observable, take} from "rxjs";
import {User} from "../shared/models/user";

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private imageService = inject(ImageService);

  private _ads = new BehaviorSubject<Ad[]>([]);
  private _searchedAds = new BehaviorSubject<Ad[]>([]);

  readonly NUM_OF_STARTING_ADS = 10;
  readonly NUM_OF_ADS_TO_LOAD = 5;

  ads$: Observable<Ad[]>;
  searchedAds$: Observable<Ad[]>;


  user: User | null = null;


  constructor(private angularFirestore: AngularFirestore,
              private auth: Auth,
              private _authService: AuthService,
              private router: Router) {

    // Create the observable array for consumption in components
    this.ads$ = this._ads.asObservable();
    this.searchedAds$ = this._searchedAds.asObservable();

    this._authService.user$.subscribe(user => {
      this.user = user;
    })
  }

  async createAd(value: CreateAd, images?: GalleryPhoto[]) {
    if (!this.user) {
      await this.router.navigate(['/login']);
    }

    const data = {
      category: value.category,
      subcategory: value.subcategory,
      buyOrSell: value.buyOrSell,
      title: value.title,
      title_lowercase: value.title.toLowerCase(),
      city: value.city,
      price: value.price,
      currency: value.currency,
      phone: value.phone,
      quantity: value.quantity,
      measure: value.measure,
      description: value.description,
      ownerId: this.user!.uid,
      ownerName: this.user!.displayName,
      uploadedAt: new Date(),
      images: []
    };

    const adRef = await this.angularFirestore.collection('ads').add(data);

    return adRef.id;
  }


  getAds(lastVisible?: Ad) {
    let query;
    if (!lastVisible) {
      query = this.angularFirestore
        .collection('ads', ref => ref
          .orderBy('uploadedAt', 'desc')
          .limit(this.NUM_OF_STARTING_ADS)
        );
    } else {
      query = this.angularFirestore
        .collection('ads', ref => ref
          .orderBy('uploadedAt', 'desc')
          .limit(this.NUM_OF_ADS_TO_LOAD)
          .startAfter(lastVisible.uploadedAt)
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
    console.log('resetting ads')
    this._ads.next([]);
    this._searchedAds.next([]);
    this.getAds();
  }

  // Maps the snapshot to usable format
  private mapAndUpdate(col: AngularFirestoreCollection<any>, searched = false) {

    return col.snapshotChanges()
      .pipe(
        map((actions) => {
          const values = actions.map(it => {
            const data = it.payload.doc.data();
            const id = it.payload.doc.id;
            return {id, ...data} as Ad;
          })

          const currentAds = this._ads.getValue();

          // Update source with values
          if (searched) {
            this._searchedAds.next([...values]);
          } else {
            this._ads.next([...currentAds, ...values]);
          }

          return actions;
        }),
        take(1)
      )
      .subscribe()
  }
}

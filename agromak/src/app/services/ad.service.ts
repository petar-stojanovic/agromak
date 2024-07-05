import {inject, Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Auth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {GalleryPhoto} from "@capacitor/camera";
import {CreateAd} from "../shared/models/create-ad";
import {ImageService} from "./image.service";
import {AuthService} from "./auth.service";
import {Ad} from "../shared/models/ad";
import {BehaviorSubject, map, mergeScan, Observable, of, scan, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private imageService = inject(ImageService);

  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _ads = new BehaviorSubject<Ad[]>([]);

  done$ = this._done.asObservable();
  loading$ = this._loading.asObservable();
  // data$ = this._data.asObservable();
  ads$: Observable<Ad[]>;


  constructor(private angularFirestore: AngularFirestore,
              private auth: Auth,
              private _authService: AuthService,
              private router: Router) {

    // Create the observable array for consumption in components
    this.ads$ = this._ads.asObservable();

  }

  async createAd(value: CreateAd, images?: GalleryPhoto[]) {
    this._authService.user$
      .subscribe({
          next: async (user) => {
            if (user === null) {
              return;
            }
            const owner = user;

            const data = {
              category: value.category,
              subcategory: value.subcategory,
              buyOrSell: value.buyOrSell,
              title: value.title,
              city: value.city,
              price: value.price,
              currency: value.currency,
              phone: value.phone,
              quantity: value.quantity,
              measure: value.measure,
              description: value.description,
              ownerId: owner.uid,
              ownerName: owner.displayName,
              uploadedAt: new Date(),
              images: []
            };


            const adRef = await this.angularFirestore.collection('ads').add(data);
            console.log(adRef.id);

            if (images) {
              await this.imageService.uploadAdImages(adRef.id, images);
            }
          }
        }
      );
  }


  getAds(lastVisible?: Ad) {
    let query = this.angularFirestore
      .collection('ads', ref => ref
        .orderBy('uploadedAt', 'desc')
        .limit(10)
      );

    if (lastVisible) {
      query = this.angularFirestore
        .collection('ads', ref => ref
          .orderBy('uploadedAt', 'desc')
          .limit(3)
          .startAfter(lastVisible.uploadedAt)
        );
    }

    this.mapAndUpdate(query);
    //return this.angularFirestore.collection('ads').get();
  }


  getAdById(id: string) {
    return this.angularFirestore.doc(`ads/${id}`).get();
  }

  // Maps the snapshot to usable format
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {

    return col.snapshotChanges()
      .pipe(
        map((actions) => {
          const values = actions.map(it => {
            const data = it.payload.doc.data();
            const id = it.payload.doc.id;
            return {id, ...data} as Ad;
          })

          const currentAds = this._ads.getValue();

          // update source with values
          this._ads.next([...currentAds, ...values]);

          return actions;
        }),
        take(1)
      )
      .subscribe()
  }
}

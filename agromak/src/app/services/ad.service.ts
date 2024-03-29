import {inject, Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Auth} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {GalleryPhoto} from "@capacitor/camera";
import {CreateAd} from "../shared/interfaces/create-ad";
import {ImageService} from "./image.service";
import {AuthService} from "./auth.service";
import {User} from "../shared/interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private imageService = inject(ImageService);

  constructor(private angularFirestore: AngularFirestore,
              private auth: Auth,
              private _authService: AuthService,
              private router: Router) {
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


  getAllAds() {
    return this.angularFirestore.collection('ads').get();
  }

  getAdById(id: string) {
    return this.angularFirestore.doc(`ads/${id}`).get();
  }


  // private increment() {
  //   const statsRef = this.angularFirestore.collection('ads').doc('--stats--');
  //   statsRef.update({
  //     count: FieldValue.increment(1)
  //   })
  //   return statsRef.get()
  // }
}

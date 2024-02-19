import {inject, Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Auth} from "@angular/fire/auth";
import {Firestore} from "@angular/fire/firestore";
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {GalleryPhoto} from "@capacitor/camera";
import {CreateAd} from "../interfaces/create-ad";
import {ImageService} from "./image.service";

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private imageService = inject(ImageService);

  constructor(private afAuth: AngularFireAuth,
              private angularFirestore: AngularFirestore,
              private auth: Auth,
              private firestore: Firestore,
              private router: Router) {
  }

  async createAd(value: CreateAd, images?: GalleryPhoto[]) {

    const data = {
      buyOrSell: value.buyOrSell,
      title: value.title,
      city: value.city,
      price: value.price,
      currency: value.currency,
      phone: value.phone,
      quantity: value.quantity,
      measure: value.measure,
      description: value.description,
      ownerId: this.auth.currentUser?.uid,
      uploadedAt: new Date(),
      images: []
    };


    const adRef = await this.angularFirestore.collection('ads').add(data);
    console.log(adRef.id);

    if (images) {
      await this.imageService.uploadAdImages(adRef.id, images);
    }
  }


  getAllAds(){
    return this.angularFirestore.collection('ads').get();
  }
}

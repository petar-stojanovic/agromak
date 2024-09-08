import {Injectable} from '@angular/core';
import {CreateAd} from "../shared/models/create-ad";
import {GalleryPhoto} from "@capacitor/camera";
import {CreateDynamicAd} from "../shared/models/create-dynamic-ad-";
import {UpdateDynamicAd} from "../shared/models/update-dynamic-ad-";
import {deleteDoc, deleteField, doc, Firestore, updateDoc} from "@angular/fire/firestore";
import {Ad} from "../shared/models/ad";
import {User} from "../shared/models/user";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "./auth.service";
import {ImageService} from "./image.service";
import {ApiService} from "./api.service";
import firebase from "firebase/compat/app";
import FieldValue = firebase.firestore.FieldValue;

@Injectable({
  providedIn: 'root'
})
export class AdManagementService {
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

  async createAd(value: CreateAd, images?: GalleryPhoto[]) {

    const data = {
      ...value,
      title_lowercase: value.title.toLowerCase(),
      category: value.category,
      subcategory: value.subcategory,
      ownerId: this.user.uid,
      ownerName: this.user.displayName,
      uploadedAt: new Date(),
      viewCount: 1,
      images: []
    };

    const adRef = await this.angularFirestore.collection('ads').add(data);

    return adRef.id;
  }

  getAdById(id: string) {
    return this.apiService.docDataQuery(`ads/${id}`)
  }

  async createDynamicAd(dynamicAd: CreateDynamicAd) {
    const data = {
      ...dynamicAd,
      title_lowercase: dynamicAd.title.toLowerCase(),
      keywords: this.extractKeywords(dynamicAd.title.toLowerCase()),
      ownerId: this.user.uid,
      ownerName: this.user.displayName,
      viewCount: 1,
      uploadedAt: new Date(),
      images: []
    };

    const adRef = await this.angularFirestore.collection('ads').add(data);

    if (dynamicAd.images && dynamicAd.images.length > 0) {
      await this.imageService.uploadAdImages(adRef.id, dynamicAd.images);
    }
  }

  async updateAd(ad: UpdateDynamicAd) {
    const adDocRef = this.apiService.docRef(`ads/${ad.id}`);

    const {images, ...adDataWithoutImages} = ad;

    const updatedAdData = {
      ...adDataWithoutImages,
      title_lowercase: ad.title.toLowerCase(),
      keywords: this.extractKeywords(ad.title.toLowerCase()),
    }

    await updateDoc(adDocRef, updatedAdData)

    if (images && images.length > 0) {
      await this.imageService.uploadAdImages(ad.id, images);
    }
  }

  async deleteAd(ad: Ad) {
    const adDocRef = doc(this.firestore, `ads/${ad.id}`);
    await this.imageService.deleteImages(ad, ad.images);
    return await deleteDoc(adDocRef);
  }

  async incrementAdViewCount(id: string) {
    const adDocRef = doc(this.firestore, `ads/${id}`);
    return await updateDoc(adDocRef, {
      viewCount: FieldValue.increment(1)
    });
  }

  private extractKeywords(text: string): string[] {
    return text
      .toLowerCase()
      .split(' ')
      .filter(word => word.length > 2); // Simple example: exclude single-letter words
  }
}

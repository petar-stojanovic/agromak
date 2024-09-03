import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {User} from "../shared/models/user";
import {AdFetchType} from "../shared/ad-fetch-type.enum";
import {Firestore} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";
import {ImageService} from "./image.service";
import {ApiService} from "./api.service";
import {AdFetchingService} from "./ad-fetching.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user!: User;

  constructor(private angularFirestore: AngularFirestore,
              private authService: AuthService,
              private apiService: ApiService,
              private adFetchingService: AdFetchingService
  ) {

    this.authService.user$.subscribe(user => {
      this.user = user;
    })
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

    this.adFetchingService.fetchAds(AdFetchType.FAVORITE, {order: "desc"}).subscribe();
  }
}

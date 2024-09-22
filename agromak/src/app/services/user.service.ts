import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {User} from "../shared/models/user";
import {AdFetchType} from "../shared/enums/ad-fetch-type.enum";
import {AuthService} from "./auth.service";
import {ApiService} from "./api.service";
import {AdFetchingService} from "./ad-fetching.service";
import firebase from "firebase/compat/app";
import {SearchHistory, UserSearchHistory} from "../shared/models/user-search-history";
import Timestamp = firebase.firestore.Timestamp;
import {updateDoc} from "@angular/fire/firestore";

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
    await userRef.update(data);

    this.adFetchingService.clearAds(AdFetchType.FAVORITE);
    this.adFetchingService.fetchAds(AdFetchType.FAVORITE, {order: "desc"}).subscribe();
  }

  async updateUserSearchHistory(searchValue: string) {
    const userId = this.user.uid;
    const searchValueLower = searchValue.toLowerCase();

    const userDoc = await this.apiService.getDocById(`usersSearchHistory/${userId}`);

    const currentHistory: SearchHistory[] = !userDoc.exists()
      ? []
      : (userDoc.data() as UserSearchHistory).searchHistory;

    const historyMap = new Map<string, { count: number; timestamp: Timestamp }>();

    currentHistory.forEach(entry => {
      historyMap.set(entry.searchValue, {count: entry.count, timestamp: entry.timestamp});
    });

    if (historyMap.has(searchValueLower)) {
      const entry = historyMap.get(searchValueLower)!;
      historyMap.set(searchValueLower, {count: entry.count + 1, timestamp: Timestamp.now()});
    } else {
      historyMap.set(searchValueLower, {count: 1, timestamp: Timestamp.now()});
    }

    const updatedHistory = Array.from(historyMap, ([searchValue, {count, timestamp}]) => ({
      searchValue,
      count,
      timestamp
    }));

    const data = {
      searchHistory: updatedHistory,
    };

    !userDoc.exists()
      ? await this.apiService.setDocument(`usersSearchHistory/${userId}`, data)
      : await this.apiService.updateDocument(`usersSearchHistory/${userId}`, data)
  }

  async deleteUserSearchHistory(searchValue: string) {
    const userId = this.user.uid;
    const userDoc = await this.apiService.getDocById(`usersSearchHistory/${userId}`);
    const currentHistory = (userDoc.data() as UserSearchHistory).searchHistory || [];
    const updatedHistory = currentHistory.filter(it => it.searchValue !== searchValue);

    const data = {
      searchHistory: updatedHistory,
    };
    await this.apiService.updateDocument(`usersSearchHistory/${userId}`, data);
  }


}

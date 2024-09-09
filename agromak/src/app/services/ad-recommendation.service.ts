import {Injectable} from '@angular/core';
import {UserSearchHistory} from "../shared/models/user-search-history";
import {ApiService} from "./api.service";
import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;
import {User} from "../shared/models/user";
import {AuthService} from "./auth.service";
import {filter, mergeMap, of, switchMap, take} from "rxjs";
import {AdFetchingService} from "./ad-fetching.service";
import {combineLatest} from "rxjs";

export const RECENCY_WEIGHT = 0.7;
export const COUNT_WEIGHT = 1 - RECENCY_WEIGHT;
export const RECENCY_DECAY_FACTOR = 30; // After 30 days, recency score will be 0

@Injectable({
  providedIn: 'root'
})
export class AdRecommendationService {


  user!: User;

  constructor(private apiService: ApiService,
              private authService: AuthService,
              private adFetchingService: AdFetchingService
  ) {

  }

  getRecommendations() {
    return this.authService.user$
      .pipe(
        switchMap(async user => {
          this.user = user;
          const userDoc = await this.apiService.getDocById(`usersSearchHistory/${this.user.uid}`);
          const currentHistory = (userDoc.data() as UserSearchHistory).searchHistory || [];
          const querySnapshot = await this.apiService.getDocById(`openaiKeywords/keywords`);
          const keywords = (querySnapshot.data() as any).keywords;

          const recencyMap = new Map<string, Timestamp>();
          const countMap = new Map<string, number>();

          currentHistory.forEach(entry => {
            recencyMap.set(entry.searchValue, entry.timestamp);
            countMap.set(entry.searchValue, entry.count);
          });

          const scores = Array.from(countMap.entries()).map(([searchValue, count]) => {
            const recencyScore = this.calculateRecencyScore(recencyMap.get(searchValue)!);
            const combinedScore = recencyScore * RECENCY_WEIGHT + count * COUNT_WEIGHT;
            return {searchValue, score: combinedScore};
          }).sort((a, b) => b.score - a.score)
            .map(entry => entry.searchValue)



          const searchKeywords = scores.map(searchValue => keywords[searchValue]);

          const ads$ = searchKeywords.map(keyword => this.adFetchingService.getAdsByKeywords(keyword).pipe(take(1)));

          return combineLatest(ads$);
        }),
        mergeMap(adsArray  => adsArray )
      )

  }

  private calculateRecencyScore(timestamp: Timestamp): number {
    const now = Timestamp.now();
    const ageInDays = (now.seconds - timestamp.seconds) / (60 * 60 * 24);
    return Math.max(0, 1 - ageInDays / RECENCY_DECAY_FACTOR);  // Adjust formula and decay factor as needed
  }
}

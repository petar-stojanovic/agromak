import {Component, OnInit} from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ModalController
} from "@ionic/angular/standalone";
import {AdListComponent} from "../../../shared/components/ad-list/ad-list.component";
import {AdFetchingService} from "../../../services/ad-fetching.service";
import {addIcons} from "ionicons";
import {arrowBack} from "ionicons/icons";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {AdFetchType} from "../../../shared/enums/ad-fetch-type.enum";
import {tap} from "rxjs";

@Component({
  selector: 'app-favorite-ads',
  templateUrl: './favorite-ads.component.html',
  styleUrls: ['./favorite-ads.component.scss'],
  imports: [
    AdListComponent,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonIcon,
    IonButton,
    AsyncPipe,
  ],
  standalone: true
})
export class FavoriteAdsComponent implements OnInit {

  ads$ = this.adFetchingService.favoriteAds$;
  adFetchType = AdFetchType.FAVORITE;
  isLoading = true;

  constructor(private modalCtrl: ModalController,
              private adFetchingService: AdFetchingService) {
    addIcons({arrowBack})
  }

  ngOnInit() {
    this.fetchAds();
  }

  fetchAds() {
    this.isLoading = true;
    this.adFetchingService.fetchAds(AdFetchType.FAVORITE, {order: "desc"}).pipe(tap(() => this.isLoading = false)).subscribe();
  }

  dismiss() {
    this.adFetchingService.clearAds(this.adFetchType);
    return this.modalCtrl.dismiss();
  }

}

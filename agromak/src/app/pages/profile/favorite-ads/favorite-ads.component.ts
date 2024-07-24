import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {AdListComponent} from "../../../components/ad-list/ad-list.component";
import {Ad} from "../../../shared/models/ad";
import {AdService} from "../../../services/ad.service";
import {addIcons} from "ionicons";
import {arrowBack} from "ionicons/icons";
import {delay, Subscription, tap, timer} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";

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
    NgIf
  ],
  standalone: true
})
export class FavoriteAdsComponent implements OnInit, OnDestroy {

  isLoading = true;
  ads$ = this.adService.favoriteAds$.pipe(
    tap(ads => {
      this.isLoading = false;
    })
  );

  private adsSubscription: Subscription | undefined;

  constructor(private modalCtrl: ModalController,
              private adService: AdService) {
    addIcons({arrowBack})
  }

  ngOnInit() {
    this.fetchAds();
  }

  fetchAds() {
    this.adService.updateFavoriteAds();
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

  ngOnDestroy(): void {
    this.adsSubscription?.unsubscribe();
  }
}

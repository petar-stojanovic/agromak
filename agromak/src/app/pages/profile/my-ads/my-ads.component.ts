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
import {Subscription, switchMap, tap, timer} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-my-ads',
  templateUrl: './my-ads.component.html',
  styleUrls: ['./my-ads.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    AdListComponent,
    IonIcon,
    IonButton,
    AsyncPipe,
    NgIf
  ],
  standalone: true
})
export class MyAdsComponent implements OnInit, OnDestroy {

  isLoading = true;
  ads$ = this.adService.myAds$.pipe(
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
    this.adsSubscription = this.adService.fetchMyAds().subscribe();
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

  ngOnDestroy(): void {
    this.adsSubscription?.unsubscribe();
  }
}

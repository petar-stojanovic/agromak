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
import {Subscription, switchMap, timer} from "rxjs";

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
    IonButton
  ],
  standalone: true
})
export class MyAdsComponent implements OnInit, OnDestroy {

  ads: Ad[] = [];
  isLoading = true;

  private adsSubscription: Subscription | undefined;

  constructor(private modalCtrl: ModalController,
              private adService: AdService) {
    addIcons({arrowBack})
  }

  ngOnInit() {
    this.fetchAds();
  }

  fetchAds() {
    this.adService.getMyAds().subscribe(ads => {
      this.ads = ads;
      this.isLoading = false;
    });
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

  ngOnDestroy(): void {
    this.adsSubscription?.unsubscribe();
  }
}

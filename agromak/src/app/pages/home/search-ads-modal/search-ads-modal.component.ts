import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Ad} from "../../../shared/models/ad";
import {DatePipe, NgIf} from "@angular/common";
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonTitle,
  IonToolbar,
  ModalController
} from "@ionic/angular/standalone";
import {AdService} from "../../../services/ad.service";
import {AdListComponent} from "../../../components/ad-list/ad-list.component";
import {Subscription, switchMap, timer} from "rxjs";
import {addIcons} from "ionicons";
import {arrowBack, filterCircleOutline} from "ionicons/icons";

@Component({
  selector: 'app-search-ads-modal',
  templateUrl: './search-ads-modal.component.html',
  styleUrls: ['./search-ads-modal.component.scss'],
  imports: [
    DatePipe,
    IonBackButton,
    IonButtons,
    IonHeader,
    IonTitle,
    IonToolbar,
    NgIf,
    IonContent,
    AdListComponent,
    IonIcon,
    IonButton,
    IonModal,
    IonList,
    IonItem,
    IonAvatar,
    IonImg,
    IonLabel
  ],
  standalone: true
})
export class SearchAdsModalComponent implements OnInit, OnDestroy {

  @Input() searchValue!: string;

  ads: Ad[] = [];
  isLoading = true;

  private adsSubscription: Subscription | undefined;

  constructor(private modalCtrl: ModalController,
              private adService: AdService) {
    addIcons({filterCircleOutline, arrowBack})
  }


  ngOnInit() {
    this.fetchAds();
  }

  fetchAds() {
    this.adsSubscription = this.adService.searchedAds$
      .pipe(
        switchMap((ads) => {
          this.ads = ads;
          return ads.length > 0 ? timer(1000) : timer(3500);
        })
      )
      .subscribe(() => {
        this.isLoading = false;
      });

    this.adService.searchAds(this.searchValue);
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

  ngOnDestroy(): void {
    this.adsSubscription?.unsubscribe();
  }
}

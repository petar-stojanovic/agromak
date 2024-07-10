import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Ad} from "../../shared/models/ad";
import {DatePipe, NgIf} from "@angular/common";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController
} from "@ionic/angular/standalone";
import {AdService} from "../../services/ad.service";
import {AdListComponent} from "../ad-list/ad-list.component";
import {Subscription, switchMap, timer} from "rxjs";

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
    AdListComponent
  ],
  standalone: true
})
export class SearchAdsModalComponent implements OnInit, OnDestroy {

  @Input() searchValue!: string;

  ads: Ad[] = [];
  isLoading = true;

  // Subscription to the searchedAds$ observable
  private adsSubscription: Subscription | undefined;

  constructor(private modalCtrl: ModalController,
              private _adService: AdService) {
  }


  ngOnInit() {
    this.fetchAds();
  }

  fetchAds() {
    this.adsSubscription = this._adService.searchedAds$
      .pipe(
        switchMap((ads) => {
          this.ads = ads;
          return ads.length > 0 ? timer(1000) : timer(3500);
        })
      )
      .subscribe(() => {
        this.isLoading = false;
      });

    this._adService.searchAds(this.searchValue);
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

  ngOnDestroy(): void {
    this.adsSubscription?.unsubscribe();
  }
}

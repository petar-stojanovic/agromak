import {Component, Input, OnInit} from '@angular/core';
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
export class SearchAdsModalComponent  implements OnInit {

  @Input() searchValue!: string;

  ads: Ad[] = [];
  isLoading = true;


  constructor(private modalCtrl: ModalController,
              private _adService: AdService) { }

  ngOnInit() {
    this.getAds();
  }

  getAds() {
    this.ads = [];
    this.isLoading = true;

    this._adService.searchedAds$
      .subscribe(async (ads) => {
        this.ads = ads;
        console.log('Searched Ads:', ads)
        setTimeout(() => {
          this.isLoading = ads.length === 0;
        }, 1500);
      });

    this._adService.searchAds(this.searchValue);
  }


  dismiss() {
    this._adService.resetAds()
    return this.modalCtrl.dismiss();
  }

}

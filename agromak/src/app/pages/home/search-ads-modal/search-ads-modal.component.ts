import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
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
import {AdFetchType} from "../../../shared/ad-fetch-type.enum";

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
    IonLabel,
    AsyncPipe
  ],
  standalone: true
})
export class SearchAdsModalComponent implements OnInit, OnDestroy {

  @Input() searchValue!: string;

  ads$ = this.adService.searchedAds$;
  isLoading = true;


  constructor(private modalCtrl: ModalController,
              private adService: AdService) {
    addIcons({filterCircleOutline, arrowBack})
  }


  ngOnInit() {
    this.fetchAds();
  }

  fetchAds() {
    this.adService.fetchAds(AdFetchType.SEARCHED, {searchValue: this.searchValue});
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    this.adService.clearSearchedAds();
  }

  protected readonly AdFetchType = AdFetchType;
}

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
import {AdFetchingService} from "../../../services/ad-fetching.service";
import {AdListComponent} from "../../../components/ad-list/ad-list.component";
import {addIcons} from "ionicons";
import {arrowBack, filterCircleOutline} from "ionicons/icons";
import {AdFetchType} from "../../../shared/ad-fetch-type.enum";
import {tap} from "rxjs";

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

  ads$ = this.adFetchingService.searchedAds$;

  adFetchType = AdFetchType;
  isLoading = true;

  constructor(private modalCtrl: ModalController,
              private adFetchingService: AdFetchingService) {
    addIcons({filterCircleOutline, arrowBack})
  }


  ngOnInit() {
    this.fetchAds();
  }

  fetchAds() {
    this.adFetchingService.fetchAds(AdFetchType.SEARCHED, {
      searchValue: this.searchValue.toLowerCase(),
      order: "desc"
    }).pipe(tap(() => this.isLoading = false)).subscribe();
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    this.adFetchingService.clearSearchedAds();
  }
}

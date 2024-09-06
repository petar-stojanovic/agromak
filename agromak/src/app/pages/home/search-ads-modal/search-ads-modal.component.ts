import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  ModalController,
} from "@ionic/angular/standalone";
import {AdFetchingService} from "../../../services/ad-fetching.service";
import {AdListComponent} from "../../../components/ad-list/ad-list.component";
import {addIcons} from "ionicons";
import {arrowBack, filterCircleOutline, searchOutline} from "ionicons/icons";
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
    AsyncPipe,
    IonPicker,
    IonPickerColumn,
    IonPickerColumnOption,
    IonSearchbar,
  ],
  standalone: true
})
export class SearchAdsModalComponent implements OnInit, OnDestroy {

  @Input() searchValue!: string;

  ads$ = this.adFetchingService.searchedAds$;

  @ViewChild('searchbar', {static: false}) searchbar!: IonSearchbar;

  adFetchType = AdFetchType.SEARCHED;
  isLoading = true;
  orderDirection: 'asc' | 'desc' = 'desc';

  isSearchBarOpened = false;

  constructor(private modalCtrl: ModalController,
              private adFetchingService: AdFetchingService) {
    addIcons({filterCircleOutline, arrowBack, searchOutline})
  }


  ngOnInit() {
    this.fetchAds();
  }

  fetchAds() {
    this.adFetchingService.fetchAds(AdFetchType.SEARCHED, {
      searchValue: this.searchValue.toLowerCase(),
      order: this.orderDirection
    }).pipe(tap(() => this.isLoading = false)).subscribe();
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    this.clearAds();
  }

  onIonChange(event: CustomEvent) {
    this.orderDirection = event.detail.value;
  }

  onDidDismiss(event: CustomEvent) {
    if (event.detail.role === "confirm") {
      this.isLoading = true;
      this.clearAds();
      this.fetchAds();
    }
  }

  search(event: CustomEvent) {
    if (event.detail.value === '') {
      return;
    }
    this.searchValue = event.detail.value;
    this.clearAds();
    this.fetchAds();
    this.isSearchBarOpened = false;
  }

  clearAds() {
    this.adFetchingService.clearAds(this.adFetchType);
  }

  openSearchBar() {
    this.isSearchBarOpened = true;
    setTimeout(async () => {
      await this.searchbar.setFocus();
    }, 150);

  }
}

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
import {AdListComponent} from "../../../components/ad-list/ad-list.component";
import {AdFetchingService} from "../../../services/ad-fetching.service";
import {addIcons} from "ionicons";
import {arrowBack, logoGoogle} from "ionicons/icons";
import {tap} from "rxjs";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Ad} from "../../../shared/models/ad";
import {AdFetchType} from "../../../shared/ad-fetch-type.enum";

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
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class FavoriteAdsComponent implements OnInit {

  isLoading = true;
  ads$ = this.adFetchingService.favoriteAds$;
  protected readonly AdFetchType = AdFetchType;

  constructor(private modalCtrl: ModalController,
              private adFetchingService: AdFetchingService) {
    addIcons({arrowBack})
  }

  ngOnInit() {
    this.fetchAds();
  }

  fetchAds() {
    this.adFetchingService.fetchAds(AdFetchType.FAVORITE);
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

}

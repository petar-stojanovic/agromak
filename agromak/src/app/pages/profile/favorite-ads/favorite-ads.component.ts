import { Component, OnInit } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController
} from "@ionic/angular/standalone";
import {AdListComponent} from "../../../components/ad-list/ad-list.component";
import {Ad} from "../../../shared/models/ad";
import {AdService} from "../../../services/ad.service";

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
    IonToolbar
  ],
  standalone: true
})
export class FavoriteAdsComponent   implements OnInit {

  ads: Ad[] = [];
  isLoading = true;

  constructor(private modalCtrl: ModalController,
              private adService: AdService) { }

  ngOnInit() {

  }


  dismiss() {
    return this.modalCtrl.dismiss();
  }
}

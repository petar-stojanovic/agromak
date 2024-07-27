import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon, IonItemDivider,
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
import {AddProductModalComponent} from "../../home/add-product-modal/add-product-modal.component";
import {EditAdModalComponent} from "../../../components/edit-ad-modal/edit-ad-modal.component";

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
    NgIf,
    IonItemDivider
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

  async editAd(ad: Ad, $event: MouseEvent) {
    const modal = await this.modalCtrl.create({
      component: EditAdModalComponent,
      componentProps: {
        ad: ad
      }
    });
    await modal.present();
  }

  promoteAd(ad: Ad, $event: MouseEvent) {
    console.log('Promote Ad:', ad);
  }

  deleteAd(ad: Ad, $event: MouseEvent) {
    console.log('Delete Ad:', ad);
  }
}

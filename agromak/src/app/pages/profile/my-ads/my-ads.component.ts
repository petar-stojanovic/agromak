import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AlertController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItemDivider,
  IonTitle,
  IonToolbar,
  LoadingController,
  ModalController,
  ToastController
} from "@ionic/angular/standalone";
import {AdListComponent} from "../../../components/ad-list/ad-list.component";
import {Ad} from "../../../shared/models/ad";
import {AdFetchingService} from "../../../services/ad-fetching.service";
import {addIcons} from "ionicons";
import {arrowBack, arrowDownOutline, arrowUpOutline} from "ionicons/icons";
import {Subscription} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {DynamicFormModalComponent} from "../../home/dynamic-form-modal/dynamic-form-modal.component";
import {AdFetchType} from "../../../shared/ad-fetch-type.enum";
import {AdManagementService} from "../../../services/ad-management.service";

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

  ads: Ad[] = [];

  orderDirection: 'asc' | 'desc' = 'desc';

  adFetchType = AdFetchType;
  private adsSubscription: Subscription | undefined;

  constructor(private modalCtrl: ModalController,
              private loadingController: LoadingController,
              private toastController: ToastController,
              private alertController: AlertController,
              private adFetchingService: AdFetchingService,
              private adManagementService: AdManagementService) {
    addIcons({arrowBack, arrowDownOutline, arrowUpOutline})
  }

  ngOnInit() {
    this.fetchAds();
  }

  fetchAds() {
    this.adsSubscription = this.adFetchingService.myAds$.subscribe(ads => {
      this.ads = ads;
    });
    this.adFetchingService.fetchAds(AdFetchType.MY_ADS, {
      lastVisibleAd: this.ads[this.ads.length - 1],
      order: this.orderDirection
    }).subscribe();
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

  ngOnDestroy(): void {
    this.adsSubscription?.unsubscribe();
  }

  async editAd(ad: Ad, $event: MouseEvent) {
    const modal = await this.modalCtrl.create({
      component: DynamicFormModalComponent,
      componentProps: {
        ad: ad
      }
    });
    await modal.present();
  }

  promoteAd(ad: Ad, $event: MouseEvent) {
    console.log('Promote Ad:', ad);
  }

  async deleteAd(ad: Ad, $event: MouseEvent) {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to delete this Ad?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Delete',
        handler: async () => {
          await this.adManagementService.deleteAd(ad);
          const toast = await this.toastController.create({
            message: 'Ad deleted successfully',
            duration: 2000,
          });
          await toast.present();
        }
      }]
    });
    await alert.present();

  }

  swapOrderDirection() {
    this.orderDirection = this.orderDirection === 'desc' ? 'asc' : 'desc';
    this.adFetchingService.clearMyAds();
    this.adFetchingService.fetchAds(AdFetchType.MY_ADS, {order: this.orderDirection}).subscribe();

  }
}

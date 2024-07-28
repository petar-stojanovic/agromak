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
import {AdService} from "../../../services/ad.service";
import {addIcons} from "ionicons";
import {arrowBack} from "ionicons/icons";
import {Subscription, tap} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {DynamicFormModalComponent} from "../../home/dynamic-form-modal/dynamic-form-modal.component";

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
              private loadingController: LoadingController,
              private toastController: ToastController,
              private alertController: AlertController,
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
          await this.adService.deleteAd(ad);
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
}

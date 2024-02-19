import {Haptics, ImpactStyle} from '@capacitor/haptics';
import {Component} from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader, IonRefresher, IonRefresherContent, IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';
import {AddProductModalComponent} from "../../components/add-product-modal/add-product-modal.component";
import {AdService} from "../../services/ad.service";
import {NgForOf, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {RefresherCustomEvent} from "@ionic/angular";
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonList, IonItem, NgForOf, IonLabel, IonListHeader, IonText, IonThumbnail, NgIf, IonRefresher, IonRefresherContent, IonSkeletonText],
})
export class HomePage {

  ads: any;

  placeholderArray = new Array(5);

  constructor(private modalCtrl: ModalController,
              private _adService: AdService) {
    addIcons({})
    // this.openModal();
    this.getAllAds();
  }

  async getAllAds(event?: RefresherCustomEvent) {
    if (event) {
      await Haptics.impact({style: ImpactStyle.Medium});
      this.ads = [];
    }
    this._adService.getAllAds().subscribe((ads) => {
      this.ads = ads.docs.map((ad) => ad.data());
      console.log(ads)
      if (event) {
        event.target.complete();
      }
    });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddProductModalComponent,
    });
    await modal.present();

    const {data, role} = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('Data:', data);
    }
  }

  async handleRefresh(event: RefresherCustomEvent) {
    await Haptics.impact({style: ImpactStyle.Medium});
    this.ads = [];

    this.getAllAds();

    setTimeout(() => {
      // Any calls to load data go here
      this.getAllAds();
      event.target.complete();
    }, 2000);
  }
}

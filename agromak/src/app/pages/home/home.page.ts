import {Component} from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon, IonItem, IonLabel, IonList,
  IonTitle,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';
import {AddProductModalComponent} from "../../components/add-product-modal/add-product-modal.component";
import {AdService} from "../../services/ad.service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonList, IonItem, NgForOf, IonLabel],
})
export class HomePage {

  ads: any;
  constructor(private modalCtrl: ModalController,
              private _adService: AdService) {
    // this.openModal();
    this._adService.getAllAds().subscribe((ads) => {
      this.ads = ads.docs.map((ad) => ad.data());
      console.log(this.ads);
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

}

import {Haptics, ImpactStyle} from '@capacitor/haptics';
import {Component} from '@angular/core';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
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
import {Ad} from "../../shared/interfaces/ad";
import {add} from "ionicons/icons";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonList, IonItem, NgForOf, IonLabel, IonListHeader, IonText, IonThumbnail, NgIf, IonRefresher, IonRefresherContent, IonSkeletonText, IonFabButton, IonFab, RouterLink],
})
export class HomePage {

  ads: Ad[] = [];

  placeholderArray = new Array(6);
  isLoading = true;

  constructor(private modalCtrl: ModalController,
              private _adService: AdService) {
    addIcons({add})
    // this.openModal();
    this.getAllAds();
  }

  getAllAds(event?: RefresherCustomEvent) {
    this.isLoading = true;
    this.ads = [];

    this._adService.getAllAds().subscribe({
      next: (ads) => {
        this.ads = ads.docs.map((ad) => {
          const data: any = ad.data();
          const id = ad.id;
          return {id, ...data} as Ad;
        });

        console.log(this.ads)
      },
      complete: async () => {
        if (event) {
          await Haptics.impact({style: ImpactStyle.Medium});
          await event.target.complete();
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 1500);
        // }, 100);
      }
    })
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

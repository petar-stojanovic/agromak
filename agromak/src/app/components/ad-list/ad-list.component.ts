import {Component, Input} from '@angular/core';
import {Ad} from "../../shared/models/ad";
import {InfiniteScrollCustomEvent} from "@ionic/angular";
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  ModalController
} from "@ionic/angular/standalone";
import {AdDetailsModalComponent} from "../ad-details-modal/ad-details-modal.component";
import {AdService} from "../../services/ad.service";

@Component({
  selector: 'app-ad-list',
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.scss'],
  imports: [
    IonList,
    IonItem,
    IonSkeletonText,
    IonThumbnail,
    IonLabel,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonText

  ],
  standalone: true
})
export class AdListComponent {
  @Input()
  ads: Ad[] = [];

  @Input()
  isLoading = true;

  placeholderArray = new Array(10);

  constructor(private modalCtrl: ModalController,
              private adService: AdService) {
  }

  async openAdDetailsModal(ad: Ad) {
    const modal = await this.modalCtrl.create({
      component: AdDetailsModalComponent,
      componentProps: {ad}
    });
    await modal.present();

    const {data, role} = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('Data:', data);
    }
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.generateMoreItems();
    setTimeout(() => {
      ev.target.complete();
    }, 1000);
  }

  private generateMoreItems() {
    this.adService.getAds(this.ads[this.ads.length - 1]);
  }
}

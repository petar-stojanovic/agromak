import {Component, Input, TemplateRef} from '@angular/core';
import {Ad} from "../../shared/models/ad";
import {InfiniteScrollCustomEvent} from "@ionic/angular";
import {
  IonBadge,
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
import {NgTemplateOutlet} from "@angular/common";
import {AdFetchType} from "../../shared/ad-fetch-type.enum";
import {AdListAdditionalData} from "../../shared/models/ad-list-additional-data";


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
    IonText,
    NgTemplateOutlet,
    IonBadge,
  ],
  standalone: true
})
export class AdListComponent {
  @Input()
  ads: Ad[] = [];

  @Input()
  isLoading = false;

  @Input({required: true})
  adFetchType!: AdFetchType

  @Input()
  adContent?: TemplateRef<any>;

  @Input()
  additionalData?: AdListAdditionalData

  placeholderArray = new Array(10);

  constructor(private modalCtrl: ModalController,
              private adService: AdService) {
  }

  ngOnInit() {
    setTimeout(() => {
      // this.openAdDetailsModal(this.ads[0]);
    }, 1500);
  }

  async openAdDetailsModal(ad: Ad) {
    const modal = await this.modalCtrl.create({
      component: AdDetailsModalComponent,
      componentProps: {ad}
    });
    await modal.present();
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.fetchMoreAds();
    setTimeout(() => {
      ev.target.complete();
    }, 1000);
  }

  private fetchMoreAds() {
    // this.adService.getAds(this.ads[this.ads.length - 1]);

    this.adService.fetchAds(this.adFetchType, {
      lastVisibleAd: this.ads[this.ads.length - 1],
      searchValue: this.additionalData?.searchValue,
      order: this.additionalData?.order,
    });

  }
}

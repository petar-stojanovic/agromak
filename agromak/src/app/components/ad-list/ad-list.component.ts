import {Component, Input, TemplateRef, OnInit, OnChanges, SimpleChanges} from '@angular/core';
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
import {AdFetchingService} from "../../services/ad-fetching.service";
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
export class AdListComponent implements OnInit, OnChanges {
  @Input()
  ads: Ad[] = [];

  @Input()
  isLoading = false;

  @Input({required: true})
  adFetchType!: AdFetchType

  @Input()
  adContent?: TemplateRef<any>;

  @Input()
  additionalData!: AdListAdditionalData

  placeholderArray = new Array(10);

  #currentInfiniteEvent?: InfiniteScrollCustomEvent;

  constructor(private modalCtrl: ModalController,
              private adFetchingService: AdFetchingService) {
  }

  ngOnInit() {
    setTimeout(() => {
      // this.openAdDetailsModal(this.ads[0]);
    }, 1500);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ads'] && !changes['ads'].firstChange && this.#currentInfiniteEvent) {
      this.#currentInfiniteEvent.target.disabled = false
    }
  }

  async openAdDetailsModal(ad: Ad) {
    const modal = await this.modalCtrl.create({
      component: AdDetailsModalComponent,
      componentProps: {ad}
    });
    await modal.present();
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    this.#currentInfiniteEvent = ev;
    this.fetchMoreAds();
  }

  private fetchMoreAds() {
    console.log(this.additionalData)
    this.adFetchingService.fetchAds(this.adFetchType, {
      lastVisibleAd: this.ads[this.ads.length - 1],
      similarAd: this.additionalData.similarAd,
      searchValue: this.additionalData.searchValue,
      order: this.additionalData.order,
    }).subscribe(shouldStopFetching => {
      if (this.#currentInfiniteEvent) {
        this.#currentInfiniteEvent.target.complete();
        this.#currentInfiniteEvent.target.disabled = shouldStopFetching;
      }
    });
  }
}

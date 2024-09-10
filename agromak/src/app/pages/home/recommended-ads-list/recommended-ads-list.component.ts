import {AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, input, Renderer2, ViewChild} from '@angular/core';
import {Ad} from "../../../shared/models/ad";
import {
  IonBadge, IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle, IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonText,
  IonThumbnail, ModalController
} from "@ionic/angular/standalone";
import Swiper from "swiper";
import {AdDetailsModalComponent} from "../../../components/ad-details-modal/ad-details-modal.component";
import {trashOutline} from "ionicons/icons";
import {addIcons} from "ionicons";

@Component({
  selector: 'app-recommended-ads-list',
  templateUrl: './recommended-ads-list.component.html',
  styleUrls: ['./recommended-ads-list.component.scss'],
  imports: [
    IonBadge,
    IonItem,
    IonLabel,
    IonText,
    IonThumbnail,
    IonCard,
    IonImg,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonIcon,
    IonButton,
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecommendedAdsListComponent implements AfterViewInit {
  ads = input.required<Ad[]>();
  searchValue = input.required<string>();

  @ViewChild('swiper')
  swiper?: ElementRef<{ swiper: Swiper }>;


  constructor(private renderer: Renderer2,
              private modalCtrl: ModalController
  ) {
    addIcons({trashOutline})
  }

  ngAfterViewInit() {

    this.renderer.setProperty(this.swiper!.nativeElement, 'slidesPerView', 2)
    this.renderer.setProperty(this.swiper!.nativeElement, 'spaceBetween', 5)
    this.renderer.setProperty(this.swiper!.nativeElement, 'autoHeight', false)
  }

  async openAdDetailsModal(ad: Ad) {
    const modal = await this.modalCtrl.create({
      component: AdDetailsModalComponent,
      componentProps: {ad}
    });
    await modal.present();
  }
}

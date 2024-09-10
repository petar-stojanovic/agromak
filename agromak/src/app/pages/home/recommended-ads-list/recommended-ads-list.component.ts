import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  OnInit, Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Ad} from "../../../shared/models/ad";
import {
  IonBadge,
  IonCard, IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonItem,
  IonLabel,
  IonText,
  IonThumbnail
} from "@ionic/angular/standalone";
import {SwiperOptions} from "swiper/types";
import Swiper from "swiper";

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
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecommendedAdsListComponent implements AfterViewInit {
  ads = input.required<Ad[]>();
  @ViewChild('swiper')
  swiper?: ElementRef<{ swiper: Swiper }>;


  constructor(private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    // this.swiper?.nativeElement.swiper

    this.renderer.setProperty(this.swiper!.nativeElement, 'slidesPerView',2)
    // this.renderer.setProperty(this.swiper!.nativeElement, 'centeredSlides',true)
    // this.renderer.setProperty(this.swiper!.nativeElement, 'loop',true)
    this.renderer.setProperty(this.swiper!.nativeElement, 'spaceBetween',5)
    this.renderer.setProperty(this.swiper!.nativeElement, 'autoHeight',false)
  }

  openAdDetailsModal(ad: Ad) {
  }
}

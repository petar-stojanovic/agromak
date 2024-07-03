import {Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AdService} from "../../../services/ad.service";
import {IonicModule} from "@ionic/angular";
import {Ad} from "../../../shared/models/ad";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import Swiper from "swiper";
import {addIcons} from "ionicons";
import {callOutline, personOutline} from "ionicons/icons";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader, IonIcon, IonItem, IonItemDivider, IonList, IonListHeader,
  IonText,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-ad-details',
  templateUrl: './ad-details.page.html',
  styleUrls: ['./ad-details.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    NgForOf,
    NgIf,
    DatePipe,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonContent,
    IonTitle,
    IonText,
    IonItemDivider,
    IonList,
    IonListHeader,
    IonItem,
    IonIcon,
  ]
})
export class AdDetailsPage implements OnInit {

  id!: string;
  ad: Ad | null = null;

  @ViewChild('swiper')
  swiper?: ElementRef<{ swiper: Swiper }>;

  constructor(private _adService: AdService,
              private route: ActivatedRoute,
  ) {
    addIcons({personOutline, callOutline})
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;

    this._adService.getAdById(this.id).subscribe(it => {
      this.ad = it.data() as Ad;
    });
  }

}

import {Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AdService} from "../../../services/ad.service";
import {IonicModule} from "@ionic/angular";
import {Ad} from "../../../interfaces/ad";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import Swiper from "swiper";
import firebase from "firebase/compat";

@Component({
  selector: 'app-ad-details',
  templateUrl: './ad-details.page.html',
  styleUrls: ['./ad-details.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    NgForOf,
    NgIf,
    DatePipe
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
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;

    this._adService.getAdById(this.id).subscribe(it => {
      this.ad = it.data() as Ad;
    });
  }

}

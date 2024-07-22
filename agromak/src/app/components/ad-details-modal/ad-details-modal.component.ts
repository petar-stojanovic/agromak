import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnDestroy, OnInit} from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonList,
  IonListHeader,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
  ToastController
} from "@ionic/angular/standalone";
import {Ad} from "../../shared/models/ad";
import {DatePipe, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {callOutline, heart, heartOutline, locationOutline, personOutline} from "ionicons/icons";
import {AdService} from "../../services/ad.service";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {User} from "../../shared/models/user";

@Component({
  selector: 'app-ad-details-modal',
  templateUrl: './ad-details-modal.component.html',
  styleUrls: ['./ad-details-modal.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    DatePipe,
    NgIf,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonText,
    IonItemDivider,
    IonList,
    IonListHeader,
    IonItem,
    IonIcon
  ]
})
export class AdDetailsModalComponent implements OnInit, OnDestroy {
  @Input() ad!: Ad;

  isFavoriteAd = false;
  favoriteSubscription: Subscription | null = null;

  constructor(private modalCtrl: ModalController,
              private adService: AdService,
              private toastController: ToastController,
              private authService: AuthService) {
    addIcons({personOutline, callOutline, locationOutline, heart, heartOutline});
  }

  ngOnInit() {
    console.log(this.ad)
    this.favoriteSubscription = this.authService.user$.subscribe(user => {
      this.isFavoriteAd = !!user?.favoriteAds?.includes(this.ad.id);
    })
  }

  ngOnDestroy() {
    this.favoriteSubscription?.unsubscribe();
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

  async toggleFavorite() {
    await this.adService.toggleFavoriteAd(this.ad.id);
  }
}

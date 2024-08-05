import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnDestroy, OnInit} from '@angular/core';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonText,
  IonThumbnail,
  IonToolbar,
  ModalController,
  ToastController
} from "@ionic/angular/standalone";
import {Ad} from "../../shared/models/ad";
import {DatePipe, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {
  arrowBack,
  calendarOutline,
  callOutline,
  eyeOutline,
  heart,
  heartOutline,
  informationCircleOutline,
  locationOutline,
  personOutline
} from "ionicons/icons";
import {AdService} from "../../services/ad.service";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {User} from "../../shared/models/user";
import {ProfileInfoComponent} from "../profile-info/profile-info.component";

const icons = {
  personOutline,
  callOutline,
  locationOutline,
  heart,
  heartOutline,
  arrowBack,
  calendarOutline,
  informationCircleOutline,
  eyeOutline
};

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
    IonContent,
    IonText,
    IonList,
    IonListHeader,
    IonItem,
    IonIcon,
    IonButton,
    IonBadge,
    IonThumbnail,
    IonLabel,
    ProfileInfoComponent
  ]
})
export class AdDetailsModalComponent implements OnInit, OnDestroy {
  @Input() ad!: Ad;

  isFavoriteAd = false;
  favoriteSubscription: Subscription | null = null;

  owner: User | null = null;

  constructor(private modalCtrl: ModalController,
              private adService: AdService,
              private toastController: ToastController,
              private authService: AuthService) {
    addIcons(icons);
  }

  ngOnInit() {
    console.log(this.ad)
    this.favoriteSubscription = this.authService.user$.subscribe(async user => {
      this.isFavoriteAd = !!user?.favoriteAds?.includes(this.ad.id);
    })

    this.authService.getUserProfile(this.ad.ownerId).subscribe(user => {
      this.owner = user as User;
    });

    this.adService.incrementViewCount(this.ad.id);
  }

  ngOnDestroy() {
    this.favoriteSubscription?.unsubscribe();
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

  async toggleFavorite() {
    await this.adService.toggleFavoriteAd(this.ad.id);
    const toast = await this.toastController.create({
      message: this.isFavoriteAd ? 'Added to favorites' : 'Removed from favorites',
      duration: 1500,
    });

    await toast.present();
  }
}

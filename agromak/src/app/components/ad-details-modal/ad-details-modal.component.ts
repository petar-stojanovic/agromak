import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnDestroy, OnInit} from '@angular/core';
import {
  AlertController,
  IonAlert,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonToolbar,
  ModalController,
  ToastController
} from "@ionic/angular/standalone";
import {Ad} from "../../shared/models/ad";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {
  arrowBack,
  calendarOutline,
  callOutline,
  chatboxEllipsesOutline,
  copyOutline,
  eyeOutline,
  heart,
  heartOutline,
  informationCircleOutline,
  locationOutline
} from "ionicons/icons";
import {AuthService} from "../../services/auth.service";
import {map, Subscription, tap} from "rxjs";
import {User} from "../../shared/models/user";
import {ProfileInfoComponent} from "../profile-info/profile-info.component";
import {UserChatService} from "../../services/user-chat.service";
import {UserService} from "../../services/user.service";
import {AdManagementService} from "../../services/ad-management.service";
import {AdListComponent} from "../ad-list/ad-list.component";
import {AdFetchType} from "../../shared/ad-fetch-type.enum";
import {AdFetchingService} from "../../services/ad-fetching.service";

const icons = {
  callOutline,
  locationOutline,
  heart,
  heartOutline,
  arrowBack,
  calendarOutline,
  informationCircleOutline,
  eyeOutline,
  chatboxEllipsesOutline,
  copyOutline
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
    ProfileInfoComponent,
    IonFooter,
    IonAlert,
    AdListComponent,
    AsyncPipe,
    IonSkeletonText
  ]
})
export class AdDetailsModalComponent implements OnInit, OnDestroy {
  @Input() ad!: Ad;

  isFavoriteAd = false;
  owner: User | null = null;
  user?: User;
  isReadAllDescription = false;
  isLoading = true;
  orderDirection: 'asc' | 'desc' = 'asc';
  adFetchType = AdFetchType.SIMILAR;
  similarAds: Ad[] = [];

  private favoriteSubscription: Subscription | null = null;
  private similarAdsSubscription: Subscription | null = null;

  constructor(private modalCtrl: ModalController,
              private adManagementService: AdManagementService,
              private adFetchingService: AdFetchingService,
              private userService: UserService,
              private toastController: ToastController,
              private authService: AuthService,
              private alertController: AlertController,
              private chatService: UserChatService,
  ) {
    addIcons(icons);
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
    console.log(this.ad)
    this.initializeAdDetails();
    this.incrementViewCount();
    this.fetchSimilarAds();
  }

  private initializeAdDetails() {
    this.favoriteSubscription = this.authService.user$.subscribe((user) => {
      this.isFavoriteAd = user.favoriteAds?.includes(this.ad.id);
    });

    this.authService.getUserProfile(this.ad.ownerId).subscribe((user) => {
      this.owner = user as User;
    });
  }

  private incrementViewCount() {
    this.adManagementService.incrementAdViewCount(this.ad.id);
  }

  private fetchSimilarAds() {
    this.isLoading = true;
    this.similarAdsSubscription = this.adFetchingService.similarAds$
      .pipe(map((ads) => ads.filter((ad) => ad.id !== this.ad.id)))
      .subscribe((ads) => {
        this.similarAds = ads;
        this.isLoading = false;
      });

    this.adFetchingService.fetchAds(this.adFetchType, {
      similarAd: this.ad,
      order: this.orderDirection,
    }).subscribe();
  }


  ngOnDestroy() {
    this.favoriteSubscription?.unsubscribe();
    this.clearAds();
  }

  fetchAds() {
    this.isLoading = true;
    this.similarAdsSubscription = this.adFetchingService.similarAds$.pipe(
      map(ads => ads.filter(ad => ad.id !== this.ad.id)),
    ).subscribe((ads) => {
      this.similarAds = ads;
    });

    this.adFetchingService.fetchAds(this.adFetchType, {
      similarAd: this.ad,
      order: this.orderDirection
    }).pipe(tap(() => this.isLoading = false)).subscribe();
  }

  clearAds() {
    console.log("CLEARING ADS");
    this.similarAdsSubscription?.unsubscribe();
    this.adFetchingService.clearAds(this.adFetchType); // This assumes you have an adFetchType for each ad
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

  async toggleFavorite() {
    await this.userService.toggleFavoriteAd(this.ad.id);
    const toast = await this.toastController.create({
      message: this.isFavoriteAd ? 'Added to favorites' : 'Removed from favorites',
      duration: 1500,
    });

    this.fetchAds();

    await toast.present();
  }

  async openProfileInfoModal() {
    const modal = await this.modalCtrl.create({
      component: ProfileInfoComponent,
      componentProps: {user: this.owner}
    });

    await modal.present();
  }

  async callPerson() {
    window.open(`tel:${this.owner?.phoneNumber}`);
  }

  async openMessageModal() {
    if (this.owner === null) {
      return;
    }
    const alert = await this.alertController.create({
      header: 'Send Message',
      cssClass: 'message-alert',
      inputs: [
        {
          type: 'textarea',
          name: 'message',
          placeholder: 'Type your message here',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel',
        },
        {
          text: 'Send Message',
          role: 'send',
          handler: async (data) => {
            console.log(data['message']);

            const chatroomId = await this.chatService.createChatRoom(this.ad);
            await this.chatService.sendMessage(chatroomId, data['message']);

            const toast = await this.toastController.create({
              message: 'Message sent successfully',
              duration: 1000,
            });
            await toast.present();
            return true;
          },
        }]
    });

    await alert.present();
  }

}

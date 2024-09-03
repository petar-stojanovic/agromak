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
  chatboxEllipsesOutline,
  copyOutline,
  eyeOutline,
  heart,
  heartOutline,
  informationCircleOutline,
  locationOutline
} from "ionicons/icons";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {User} from "../../shared/models/user";
import {ProfileInfoComponent} from "../profile-info/profile-info.component";
import {UserChatService} from "../../services/user-chat.service";
import {UserService} from "../../services/user.service";
import {AdManagementService} from "../../services/ad-management.service";

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
    IonAlert
  ]
})
export class AdDetailsModalComponent implements OnInit, OnDestroy {
  @Input() ad!: Ad;

  isFavoriteAd = false;
  favoriteSubscription: Subscription | null = null;

  owner: User | null = null;
  user?: User;
  isReadAllDescription = false;

  constructor(private modalCtrl: ModalController,
              private adManagementService: AdManagementService,
              private userService: UserService,
              private toastController: ToastController,
              private authService: AuthService,
              private alertController: AlertController,
              private chatService: UserChatService) {
    addIcons(icons);
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
    console.log(this.ad)
    this.favoriteSubscription = this.authService.user$.subscribe(user => {
      this.isFavoriteAd = user.favoriteAds?.includes(this.ad.id);
    })

    this.authService.getUserProfile(this.ad.ownerId).subscribe(user => {
      this.owner = user as User;
    });

    this.adManagementService.incrementAdViewCount(this.ad.id);

    setTimeout(() => {
        // this.openMessageModal()
      }
      , 1000)
  }

  ngOnDestroy() {
    this.favoriteSubscription?.unsubscribe();
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

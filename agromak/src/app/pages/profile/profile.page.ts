import {Component, inject} from '@angular/core';
import {
  AlertController,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  LoadingController,
  ModalController
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {
  chevronForwardOutline,
  cubeOutline,
  heart,
  lockClosed,
  logOutOutline,
  notificationsOutline,
  personOutline
} from "ionicons/icons";
import {AuthService} from "../../services/auth.service";
import {RouterLink} from "@angular/router";
import {User} from "../../shared/models/user";
import {CommonModule} from "@angular/common";
import {MyAdsComponent} from "./my-ads/my-ads.component";
import {FavoriteAdsComponent} from "./favorite-ads/favorite-ads.component";
import {AdService} from "../../services/ad.service";
import {ProfileInfoComponent} from "../../components/profile-info/profile-info.component";

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonText,
    IonListHeader,
    IonIcon,
    IonSkeletonText,
    RouterLink,
    ProfileInfoComponent,
  ],
})
export class ProfilePage {
  private authService = inject(AuthService);

  user$ = this.authService.user$;

  constructor(private loadingController: LoadingController,
              private alertController: AlertController,
              private modalCtrl: ModalController,
              private adService: AdService) {
    addIcons({
      logOutOutline,
      personOutline,
      chevronForwardOutline,
      lockClosed,
      notificationsOutline,
      heart,
      cubeOutline
    })
  }

  async logOut() {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to log out?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Log Out',
        handler: () => {
          this.authService.signOut()
        }
      }]
    });
    await alert.present();
  }

  async openModal(type: string) {

    let modalType: any;
    if (type === 'myAds') {
      modalType = MyAdsComponent;
    } else if (type === 'favoriteAds') {
      modalType = FavoriteAdsComponent;
    }

    const modal = await this.modalCtrl.create({
      component: modalType,
    });
    await modal.present();
  }
}

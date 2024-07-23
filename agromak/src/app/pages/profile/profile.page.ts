import {Component, inject, Type} from '@angular/core';
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
  LoadingController, ModalController
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {
  chevronForwardOutline, cubeOutline,
  heart,
  lockClosed,
  logOutOutline,
  notificationsOutline,
  personOutline
} from "ionicons/icons";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ImageService} from "../../services/image.service";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {User} from "../../shared/models/user";
import {CommonModule} from "@angular/common";
import {MyAdsComponent} from "./my-ads/my-ads.component";
import {FavoriteAdsComponent} from "./favorite-ads/favorite-ads.component";
import {AdDetailsModalComponent} from "../../components/ad-details-modal/ad-details-modal.component";
import {AdService} from "../../services/ad.service";

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
  ],
})
export class ProfilePage {
  private authService = inject(AuthService);

  user: User | null = null;

  constructor(private router: Router,
              private loadingController: LoadingController,
              private imageService: ImageService,
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
    this.fetchData();
  }

  fetchData() {
    this.authService.user$
      .subscribe({
          next: (data) => {
            this.user = data;
          },
          error: (error) => {
            console.error('Error fetching user:', error);
            this.user = null;
          }
        }
      );
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

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });

    console.log(image)

    if (image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.imageService.uploadProfileImage(image);

      if (!result) {
        const alert = await this.alertController.create({
          header: 'Upload Failed',
          message: 'There was an error uploading your image',
          buttons: ['OK']
        });
      }
      await loading.dismiss();
    }
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

import {Component, inject} from '@angular/core';
import {
  AlertController,
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonSkeletonText,
  IonSpinner,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  LoadingController
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {exit, logOutOutline} from "ionicons/icons";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ImageService} from "../../services/image.service";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {User} from "../../interfaces/user";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonAvatar,
    IonItem,
    IonText,
    IonThumbnail,
    IonSkeletonText,
    IonSpinner,
    CommonModule
  ],
})
export class ProfilePage {
  private _authService = inject(AuthService);

  user: User | null = null;

  constructor(private router: Router,
              private loadingController: LoadingController,
              private imageService: ImageService,
              private alertController: AlertController) {
    addIcons({logOutOutline, exit})
    this._authService.getUserProfile().subscribe((data) => {
      this.user = data as User;
      console.log(data)
    })

  }

  async logOut() {
    const loading = await this.loadingController.create();
    await loading.present();

    this._authService.signOut().finally(() => {
      loading.dismiss();
    });
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

      const result = await this.imageService.uploadImage(image);

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
}

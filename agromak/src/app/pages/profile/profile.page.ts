import {Component, inject} from '@angular/core';
import {
  AlertController,
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonText,
  IonTitle,
  IonToolbar,
  LoadingController
} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {logOutOutline} from "ionicons/icons";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ImageService} from "../../services/image.service";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonButton, IonIcon, IonAvatar, NgIf, IonText, FormsModule],
})
export class ProfilePage {
  private _authService = inject(AuthService);

  profile: any = null;

  constructor(private router: Router,
              private loadingController: LoadingController,
              private imageService: ImageService,
              private alertController: AlertController) {
    addIcons({logOutOutline})
    this._authService.getUserProfile().subscribe((data) => {
      this.profile = data;
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

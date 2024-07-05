import {Component, inject} from '@angular/core';
import {AlertController, LoadingController} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {chevronForwardOutline, lockClosed, logOutOutline, notificationsOutline, personOutline} from "ionicons/icons";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ImageService} from "../../services/image.service";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {User} from "../../shared/models/user";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
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
    addIcons({logOutOutline, personOutline, chevronForwardOutline, lockClosed, notificationsOutline})
    this.fetchData();
  }

  fetchData() {
    this._authService.user$
      .subscribe({
        next: (data) => {
          this.user = data;
          // console.log(data)
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
          this._authService.signOut()
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
}

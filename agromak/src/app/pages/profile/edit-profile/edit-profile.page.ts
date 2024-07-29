import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  AlertController,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  LoadingController, ToastController
} from "@ionic/angular/standalone";
import {AuthService} from "../../../services/auth.service";
import {addIcons} from "ionicons";
import {cameraOutline} from "ionicons/icons";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {ImageService} from "../../../services/image.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, ReactiveFormsModule, IonInput, IonItem, IonLabel, IonText, IonThumbnail, IonList, IonIcon]
})
export class EditProfilePage implements OnInit {

  user$ = this.authService.user$;
  form!: FormGroup;

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private loadingController: LoadingController,
              private imageService: ImageService,
              private toastController: ToastController,
              private alertController: AlertController) {
    addIcons({cameraOutline})
  }

  ngOnInit() {
    this.createForm();
    this.authService.user$.subscribe(user => {
      console.log(user);
    })
  }

  private createForm() {
    this.form = this.fb.group({
      displayName: [''],
      email: [''],
      phoneNumber: ['']
    });
  }

  onSubmit() {
    console.log(this.form.value);
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

      await this.imageService.uploadProfileImage(image);

      await loading.dismiss();

      const toast = await this.toastController.create({
        message: 'Profile photo changed successfully',
        duration: 1500,
      });

      await toast.present();
    }
  }
}

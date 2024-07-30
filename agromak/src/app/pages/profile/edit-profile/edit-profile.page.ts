import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  AlertController,
  IonBackButton, IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList, IonSelect, IonSelectOption,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  LoadingController, ToastController
} from "@ionic/angular/standalone";
import {AuthService} from "../../../services/auth.service";
import {addIcons} from "ionicons";
import {call, callOutline, cameraOutline, locationOutline, locationSharp, mail, person} from "ionicons/icons";
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";
import {ImageService} from "../../../services/image.service";
import {HttpClient} from "@angular/common/http";
import {JsonFormControls, JsonFormData} from "../../../shared/models/json-form-data";
import {InputErrorComponent} from "../../../components/input-error/input-error.component";
import {combineLatest, Observable} from "rxjs";
import {User} from "../../../shared/models/user";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, ReactiveFormsModule, IonInput, IonItem, IonLabel, IonText, IonThumbnail, IonList, IonIcon, InputErrorComponent, IonSelect, IonSelectOption, IonButton]
})
export class EditProfilePage implements OnInit {

  user: User | null = null;
  form: FormGroup | undefined;
  phoneFormControl: JsonFormControls | null = null;
  locationFormControl: JsonFormControls | null = null;

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private http: HttpClient,
              private loadingController: LoadingController,
              private imageService: ImageService,
              private toastController: ToastController,
              private alertController: AlertController) {
    addIcons({cameraOutline, mail, person, call, locationSharp})
  }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user$ = this.authService.user$;
    const location$ = this.http.get<JsonFormData>('/assets/edit-profile-form.json');

    combineLatest([user$, location$]).subscribe(async ([user, location]) => {
      console.log(user, location);
      this.user = user;
      this.phoneFormControl = location.controls[0];
      this.locationFormControl = location.controls[1];
      this.createForm();
      await loading.dismiss();
    })
  }

  private createForm() {
    this.form = this.fb.group({
      displayName: [this.user?.displayName],
      city: [this.user?.city ? this.user.city : ''],
      phoneNumber: [this.user?.phoneNumber ? this.user.phoneNumber : '', [Validators.pattern(this.phoneFormControl?.validators.pattern!)]],
    });
    console.log(this.form)
  }

  onSubmit() {
    if (this.form?.valid) {
      console.log(this.form?.value);
      this.authService.updateUser(this.form.value);
    }
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

  formatPhoneNumber(event: any, controlName: string) {
    const input = event.target.value;
    let formattedInput = input.replace(/\D/g, '');

    if (formattedInput.length >= 3) {
      formattedInput = formattedInput.slice(0, 3) + '/' + formattedInput.slice(3);
    }
    if (formattedInput.length >= 7) {
      formattedInput = formattedInput.slice(0, 7) + '-' + formattedInput.slice(7, 10);
    }

    this.form!.controls[controlName].setValue(formattedInput);
    this.form!.updateValueAndValidity();
  }
}

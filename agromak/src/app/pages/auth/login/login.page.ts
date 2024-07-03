import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {addIcons} from "ionicons";
import {eye, eyeOff, lockClosed, logoGoogle, mail, personOutline} from "ionicons/icons";
import {AuthService} from "../../../services/auth.service";
import {
  AlertController,
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonTitle,
  LoadingController
} from "@ionic/angular/standalone";
import {Router, RouterLink} from "@angular/router";
import firebase from "firebase/compat";
import FirebaseError = firebase.FirebaseError;
import {User} from "../../../shared/models/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonItem, IonInput, IonIcon, IonButton, IonText, IonContent, IonTitle, IonLabel, RouterLink, IonList]
})
export class LoginPage {

  formErrorMessages = {
    email: [
      {type: "required", message: "Please enter your Email"},
      {type: "pattern", message: "Invalid Email format"}
    ],
    password: [
      {type: "required", message: "Please enter your Password"},
      {type: "minlength", message: "The Password must be at least 8 characters"}
    ]
  }

  _authService = inject(AuthService);

  form!: FormGroup;
  screen: string = 'login';
  showPassword = false;

  user: User | null = null;

  constructor(private fb: FormBuilder,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private router: Router) {

    addIcons({mail, lockClosed, logoGoogle, eye, eyeOff})
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      email: ['test@test.com', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['Test123!', [Validators.required, Validators.minLength(8)]],
      // email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      // password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get email() {
    return this.form.get('email')!;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  get password() {
    return this.form.get('password')!;
  }


  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const formValue = this.form.value;

    this._authService
      .login(formValue.email, formValue.password)
      .then(user => {
          this.router.navigateByUrl('/app/home',);
        }
      )
      .catch((error: FirebaseError) => {
        let errorMessage = 'An error occurred during Sign In. Please try again';
        if (error.code === 'auth/invalid-credential') {
          errorMessage = 'Invalid credentials';
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.showAlert('Login Error', errorMessage);
      })
      .finally(() => {
        loading.dismiss();
      });
  }

  async signUpWithGoogle() {
    const loading = await this.loadingController.create();
    await loading.present();

    await this._authService
      .signInWithGoogle()
      .then(async user => {
        await loading.present();
        await this.router.navigateByUrl('/app/home', {replaceUrl: true});
      })
      .catch((error: any) => {
        console.log(error)
        let errorMessage = 'An error occurred during Sign In with Google. Please try again';
        if (error.message) {
          errorMessage = error.message;
        }
        this.showAlert('Google Sign In Error', errorMessage);
      })
      .finally(() => {
        loading.dismiss();
      });

  }



  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

}

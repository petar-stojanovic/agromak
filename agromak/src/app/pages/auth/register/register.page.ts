import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
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
import {addIcons} from "ionicons";
import {eye, eyeOff, lockClosed, logoGoogle, mail, person} from "ionicons/icons";
import {AuthService} from "../../../services/auth.service";
import firebase from "firebase/compat";
import {ShowHidePasswordComponent} from "../show-hide-password/show-hide-password.component";
import FirebaseError = firebase.FirebaseError;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ShowHidePasswordComponent, IonItem, IonInput, IonIcon, IonButton, IonText, IonContent, IonTitle, IonLabel, RouterLink, IonList]
})
export class RegisterPage {

  formErrorMessages = {
    email: [
      {type: "required", message: "Please enter your Email"},
      {type: "pattern", message: "Invalid Email format"}
    ],
    password: [
      {type: "required", message: "Please enter your Password"},
      {type: "minlength", message: "The Password must be at least 8 characters"},
      {type: "passwordsDontMatchError", message: "Passwords must match"}
    ],
    confirmPassword: [
      {type: "passwordsDontMatchError", message: "Passwords must match"},
    ]
  }

  _authService = inject(AuthService);

  form!: FormGroup;
  screen: string = 'login';
  showPassword = false;
  showConfirmPassword = false;


  constructor(private fb: FormBuilder,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private router: Router) {

    addIcons({person, lockClosed, mail, logoGoogle, eye, eyeOff})
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
        // name: ['Test Testing', [Validators.required]],
        // email: ['test@test.com', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
        // password: ['Test123!', [Validators.required, Validators.minLength(8)]],
        // confirmPassword: ['Test123!', [Validators.required, matchPasswordValidator()]],
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: this.passwordMatchValidator
      });

    this.form.valueChanges.subscribe(() => {
      console.log(this.form.errors)
    })
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")?.value;
    const confirmPassword = form.get("confirmPassword")?.value;
    return password === confirmPassword ? null : {mismatch: true};
  }

  get email() {
    return this.form.get('email')!;
  }

  get password() {
    return this.form.get('password')!;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get confirmPassword() {
    return this.form.get('confirmPassword')!;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async register() {
    if (this.form && this.form.valid) {
      const loading = await this.loadingController.create();
      await loading.present();

      const formValue = this.form.value;

      this._authService
        .register(formValue.email, formValue.password)
        .then(user => {
            this.router.navigateByUrl('/app/home', {replaceUrl: true});
          }
        )
        .catch((error: FirebaseError) => {
          console.log(error)
          let errorMessage = 'An error occurred during registration. Please try again';
          if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This Email is already in use';
          } else if (error.message) {
            errorMessage = error.message;
          }
          this.showAlert('Registration Error', errorMessage);
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  async signUpWithGoogle() {
    const loading = await this.loadingController.create();
    await loading.present();

    await this._authService
      .signUpWithGoogle()
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

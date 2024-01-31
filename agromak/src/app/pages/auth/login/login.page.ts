import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {addIcons} from "ionicons";
import {lockClosed, logoGoogle, personOutline} from "ionicons/icons";
import {AuthService} from "../../../services/auth.service";
import {AlertController, LoadingController} from "@ionic/angular/standalone";
import {Router} from "@angular/router";
import firebase from "firebase/compat";
import FirebaseError = firebase.FirebaseError;
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
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

  loginForm?: FormGroup;
  registerForm?: FormGroup
  screen: string = 'login';


  constructor(private fb: FormBuilder,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private router: Router) {

    addIcons({personOutline, lockClosed, logoGoogle})
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      email: ['test@test.com', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['Test123!', [Validators.required, Validators.minLength(8)]],
    });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get("password")?.value;
    const confirmPassword = control.get("confirmPassword")?.value;
    return password === confirmPassword ? null : {mismatch: true};
  }

  get loginEmail() {
    return this.loginForm?.get('email')!;
  }

  get loginPassword() {
    return this.loginForm?.get('password')!;
  }

  get registerEmail() {
    return this.registerForm?.get('email')!;
  }

  get registerPassword() {
    return this.registerForm?.get('password')!;
  }


  changeScreen(screen: string) {
    this.screen = screen;
    if (screen === "register") {
      this.registerForm = this.fb.group({
          email: ['2001petarstojanovic@gmail.com', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
          password: ['Test123!', [Validators.required, Validators.minLength(8)]],
          confirmPassword: ['Test123!', Validators.required]
        },
        {
          validators: this.passwordMatchValidator
        });
    }
  }

  async login() {
    if (this.loginForm && this.loginForm.valid) {
      const loading = await this.loadingController.create();
      await loading.present();

      const formValue = this.loginForm.value;

      this._authService
        .login(formValue.email, formValue.password)
        .then(user => {
            this.router.navigateByUrl('/app/home', {replaceUrl: true});
          }
        )
        .catch((error: FirebaseError) => {
          console.log(error.code)
          console.log(error.message)

          let errorMessage = 'An error occurred during Sign In. Please try again';
          if (error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid credentials';
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

  async register() {
    if (this.registerForm && this.registerForm.valid) {
      const loading = await this.loadingController.create();
      await loading.present();

      const formValue = this.registerForm.value;

      this._authService
        .register(formValue.email, formValue.password)
        .then(user => {
            this.router.navigateByUrl('/app/home', {replaceUrl: true});
          }
        )
        .catch((error: FirebaseError) => {
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

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}

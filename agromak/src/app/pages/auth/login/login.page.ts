import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {addIcons} from "ionicons";
import {lockClosed, logoGoogle, personOutline} from "ionicons/icons";
import {AuthenticationService} from "../../../services/authentication.service";
import {AlertController, LoadingController} from "@ionic/angular/standalone";
import {Router} from "@angular/router";

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

  _authService = inject(AuthenticationService);

  loginForm?: FormGroup;
  registerForm?: FormGroup
  screen: string = 'login';

  isLoading: boolean = false;

  constructor(private fb: FormBuilder,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private router: Router) {

    addIcons({personOutline, lockClosed, logoGoogle})
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
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

  get registerConfirmPassword() {
    return this.registerForm?.get('confirmPassword')!;
  }

  changeScreen(screen: string) {
    this.screen = screen;
    if (screen === "register") {
      this.registerForm = this.fb.group({
          email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
          password: ['', [Validators.required, Validators.minLength(8)]],
          confirmPassword: ['', Validators.required]
        },
        {
          validators: this.passwordMatchValidator
        });
    }
  }

  login() {
    const formData: any = new FormData();
    console.log(this.loginForm?.value);
    if (this.loginForm && this.loginForm.valid) {
      this.isLoading = true
      formData.append('email', this.loginForm.get('email')?.value);
      formData.append('password', this.loginForm.get('password')?.value);
      console.log(this.loginForm)
      // this._authService.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value).then(value => {
      //     console.log(value)
      //   }
      // );
    }
  }

  register() {
    const formData: any = new FormData();
    if (this.registerForm && this.registerForm.valid) {
      this.isLoading = true
      formData.append('name', this.registerForm.get('name')?.value);
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      console.log(this.registerForm)
      // this._authService.register(this.registerForm.get('email')?.value, this.registerForm.get('password')?.value).then(user => {
      //     if (user !== null) {
      //       this.router.navigateByUrl('/app/home', {replaceUrl: true});
      //     } else {
      //       this.showAlert('Registration failed', 'Please try again!');
      //     }
      //   }
      // );
    }
  }

  logout() {
    this._authService.signOut().then(r => {
      console.log(r)
    });
  }


  showAlert(header: string, message: string) {
    const alert = this.alertController.create({
      header,
      message,
      buttons: ['OK']
    })
  }
}

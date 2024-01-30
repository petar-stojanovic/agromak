import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
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
  screen: any = 'signin';
  formData: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private router: Router) {

    addIcons({personOutline, lockClosed, logoGoogle})

    this.formData = this.fb.group({
      // name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }


  get email() {
    return this.formData.get('email')!;
  }

  get password() {
    return this.formData.get('password')!;
  }

  change(event: any) {
    this.screen = event;
  }

  login() {
    const formData: any = new FormData();
    console.log(this.formData.value);
    if (this.formData.valid) {
      this.isLoading = true
      formData.append('email', this.formData.get('email')?.value);
      formData.append('password', this.formData.get('password')?.value);
      console.log(this.formData)
      this._authService.login(this.formData.get('email')?.value, this.formData.get('password')?.value).then(value => {
          console.log(value)
        }
      );

      // this.auth.userLogin(formData).subscribe((data:any)=>{
      //   console.log(data);
      // });
    }
  }

  register() {
    const formData: any = new FormData();
    if (this.formData.valid) {
      this.isLoading = true
      formData.append('name', this.formData.get('name')?.value);
      formData.append('email', this.formData.get('email')?.value);
      formData.append('password', this.formData.get('password')?.value);
      console.log(this.formData)
      this._authService.register(this.formData.get('email')?.value, this.formData.get('password')?.value).then(value => {
          if (value !== null) {
            this.router.navigateByUrl('/app/home', {replaceUrl: true});
          } else {
            this.showAlert('Registration failed', 'Please try again!');
          }
        }
      );
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

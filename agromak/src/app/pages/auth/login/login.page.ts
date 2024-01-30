import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {addIcons} from "ionicons";
import {lockClosed, personOutline} from "ionicons/icons";

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
      {type: "pattern", message: "The Email entered is Incorrect"}
    ],
    password: [
      {type: "required", message: "Please Enter your Password"},
      {type: "minlength", message: "The Password must be at least 8 characters or more"}
    ]
  }

  screen: any = 'signin';
  formData: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder) {

    addIcons({personOutline,lockClosed})

    this.formData = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }


  change(event: any) {
    this.screen = event;
  }

  login() {
    const formData: any = new FormData();
    console.log(this.formData)
    if (this.formData.valid) {
      this.isLoading = true
      formData.append('email', this.formData.get('email')?.value);
      formData.append('password', this.formData.get('password')?.value);
      console.log(this.formData)

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
      // this.auth.userRegister(formData).subscribe((data:any)=>{
      //   console.log(data);
      // });
    }
  }

}

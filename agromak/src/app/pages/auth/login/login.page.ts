import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginPage  {

  screen: any = 'signin';
  formData: FormGroup;
  isLoading: boolean = false;
  constructor(private fb:FormBuilder) {
    this.formData = this.fb.group({
      name: ['',[Validators.required]],
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required]],
    });
  }


  change(event: any){
    this.screen = event;
  }

  login(){
    var formData: any = new FormData();
    if(this.formData.valid){
      this.isLoading = true
      formData.append('email', this.formData.get('email')?.value);
      formData.append('password', this.formData.get('password')?.value);
      console.log(this.formData)
      // this.auth.userLogin(formData).subscribe((data:any)=>{
      //   console.log(data);
      // });
    }
  }

  register(){
    var formData: any = new FormData();
    if(this.formData.valid){
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

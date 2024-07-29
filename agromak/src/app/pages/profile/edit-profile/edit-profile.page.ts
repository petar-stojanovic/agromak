import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
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
  IonToolbar
} from "@ionic/angular/standalone";
import {AuthService} from "../../../services/auth.service";
import {addIcons} from "ionicons";
import {cameraOutline} from "ionicons/icons";

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
              private fb: FormBuilder) {
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

  changeImage() {

  }
}

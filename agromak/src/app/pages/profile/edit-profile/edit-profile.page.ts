import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton]
})
export class EditProfilePage implements OnInit {

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

}

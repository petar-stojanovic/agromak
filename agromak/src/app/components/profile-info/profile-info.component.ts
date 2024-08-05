import {Component, input} from '@angular/core';
import {User} from "../../shared/models/user";
import {IonItem, IonLabel, IonSkeletonText, IonText, IonThumbnail} from "@ionic/angular/standalone";

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.scss'],
  imports: [
    IonItem,
    IonThumbnail,
    IonLabel,
    IonText,
    IonSkeletonText
  ],
  standalone: true
})
export class ProfileInfoComponent {

  user = input<User | null>();

  constructor() {
  }
}

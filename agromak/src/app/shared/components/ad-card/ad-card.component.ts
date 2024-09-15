import {Component, input} from '@angular/core';
import {Ad} from "../../models/ad";
import {IonBadge, IonItem, IonLabel, IonText, IonThumbnail} from "@ionic/angular/standalone";

@Component({
  selector: 'app-ad-card',
  templateUrl: './ad-card.component.html',
  styleUrls: ['./ad-card.component.scss'],
  imports: [
    IonBadge,
    IonItem,
    IonLabel,
    IonText,
    IonThumbnail
  ],
  standalone: true
})
export class AdCardComponent {
  ad = input.required<Ad>();

  constructor() {
  }

  openAdDetailsModal(ad: Ad) {

  }
}

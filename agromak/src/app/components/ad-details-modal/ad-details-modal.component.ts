import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit} from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonList,
  IonListHeader,
  IonText,
  IonTitle,
  IonToolbar,
  ModalController
} from "@ionic/angular/standalone";
import {Ad} from "../../shared/models/ad";
import {DatePipe, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {callOutline, locationOutline, personOutline} from "ionicons/icons";

@Component({
  selector: 'app-ad-details-modal',
  templateUrl: './ad-details-modal.component.html',
  styleUrls: ['./ad-details-modal.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    DatePipe,
    NgIf,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonText,
    IonItemDivider,
    IonList,
    IonListHeader,
    IonItem,
    IonIcon
  ]
})
export class AdDetailsModalComponent implements OnInit {
  @Input() ad!: Ad;

  constructor(private modalCtrl: ModalController) {
    addIcons({personOutline, callOutline, locationOutline})
  }

  ngOnInit() {
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }
}

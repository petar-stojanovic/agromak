import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit} from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader, IonIcon, IonItem, IonItemDivider, IonList, IonListHeader, IonText, IonThumbnail,
  IonTitle,
  IonToolbar,
  ModalController
} from "@ionic/angular/standalone";
import {Ad} from "../../shared/models/ad";
import {DatePipe, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {callOutline, personOutline} from "ionicons/icons";

@Component({
  selector: 'app-ad-details-modal',
  templateUrl: './ad-details-modal.component.html',
  styleUrls: ['./ad-details-modal.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonToolbar,
    IonHeader,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonThumbnail,
    IonText,
    NgIf,
    DatePipe,
    IonBackButton,
    IonIcon,
    IonItem,
    IonItemDivider,
    IonList,
    IonListHeader
  ]
})
export class AdDetailsModalComponent implements OnInit {
  @Input() ad!: Ad;

  constructor(private modalCtrl: ModalController) {
    addIcons({personOutline, callOutline})
  }

  ngOnInit() {
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }
}

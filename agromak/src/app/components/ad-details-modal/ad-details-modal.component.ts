import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular/standalone";
import {Ad} from "../../shared/models/ad";
import {DatePipe, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {callOutline, locationOutline, personOutline} from "ionicons/icons";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-ad-details-modal',
  templateUrl: './ad-details-modal.component.html',
  styleUrls: ['./ad-details-modal.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    DatePipe,
    NgIf
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

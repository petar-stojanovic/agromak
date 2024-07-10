import {Component, Input, OnInit} from '@angular/core';
import {Ad} from "../../shared/models/ad";
import {DatePipe, NgIf} from "@angular/common";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-search-ads-modal',
  templateUrl: './search-ads-modal.component.html',
  styleUrls: ['./search-ads-modal.component.scss'],
  imports: [
    DatePipe,
    IonBackButton,
    IonButtons,
    IonHeader,
    IonTitle,
    IonToolbar,
    NgIf,
    IonContent
  ],
  standalone: true
})
export class SearchAdsModalComponent  implements OnInit {

  @Input() searchValue!: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.searchValue);
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

}

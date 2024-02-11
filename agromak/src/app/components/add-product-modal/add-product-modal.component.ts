import {Component, OnInit} from '@angular/core';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonTitle, IonToolbar, ModalController} from "@ionic/angular/standalone";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-add-product-modal',
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    FormsModule
  ],
})
export class AddProductModalComponent implements OnInit {
  name = "";

  constructor(private modalCtrl: ModalController) {
  }

  ngOnInit() {
  }


  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

}

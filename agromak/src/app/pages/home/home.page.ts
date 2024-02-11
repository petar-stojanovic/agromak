import {Component} from '@angular/core';
import {IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon],
})
export class HomePage {
  constructor() {
  }

  addSale() {

  }
}

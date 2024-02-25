import {Component} from '@angular/core';
import {IonButton, IonContent, IonFooter, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';

@Component({
  selector: 'app-ai',
  templateUrl: 'ai.page.html',
  styleUrls: ['ai.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButton, IonIcon]
})
export class AiPage {

  constructor() {
  }

  uploadPhoto() {

  }
}

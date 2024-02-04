import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from "@angular/router";
import {addIcons} from "ionicons";
import {chevronForward} from "ionicons/icons";
import {IonButton, IonContent, IonIcon, IonImg} from "@ionic/angular/standalone";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonImg, IonContent, IonButton, IonIcon]
})
export class LandingPage implements OnInit {

  constructor() {
    addIcons({chevronForward})
  }

  ngOnInit() {
  }

}

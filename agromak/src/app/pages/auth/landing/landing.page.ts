import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {RouterLink} from "@angular/router";
import {addIcons} from "ionicons";
import {chevronForward} from "ionicons/icons";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class LandingPage implements OnInit {

  constructor() {
    addIcons({chevronForward})
  }

  ngOnInit() {
  }

}

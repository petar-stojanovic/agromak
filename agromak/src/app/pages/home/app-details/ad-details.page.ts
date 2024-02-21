import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-app-details',
  templateUrl: './ad-details.page.html',
  styleUrls: ['./ad-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class AdDetailsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

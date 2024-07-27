import {Component, Input, OnInit} from '@angular/core';
import {Ad} from "../../shared/models/ad";
import {ModalController, ToastController} from "@ionic/angular/standalone";
import {AdService} from "../../services/ad.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-edit-ad-modal',
  templateUrl: './edit-ad-modal.component.html',
  styleUrls: ['./edit-ad-modal.component.scss'],
  standalone: true
})
export class EditAdModalComponent implements OnInit {
  @Input() ad!: Ad;

  constructor(private modalCtrl: ModalController,
              private adService: AdService,
              private toastController: ToastController,
              private authService: AuthService) {
  }

  ngOnInit() {
    console.log("edit", this.ad)
  }

}

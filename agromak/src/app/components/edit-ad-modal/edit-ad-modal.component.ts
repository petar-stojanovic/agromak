import {Component, Input, OnInit} from '@angular/core';
import {Ad} from "../../shared/models/ad";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader, IonIcon, IonPopover, IonTitle, IonToolbar,
  ModalController,
  ToastController
} from "@ionic/angular/standalone";
import {AdService} from "../../services/ad.service";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {addIcons} from "ionicons";
import {arrowBack} from "ionicons/icons";

@Component({
  selector: 'app-edit-ad-modal',
  templateUrl: './edit-ad-modal.component.html',
  styleUrls: ['./edit-ad-modal.component.scss'],
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar
  ],
  standalone: true
})
export class EditAdModalComponent implements OnInit {
  @Input() ad!: Ad;
  form!: FormGroup;
  images: any[] = []; // Define your image structure accordingly

  constructor(private fb: FormBuilder,
              private modalCtrl: ModalController,
              private adService: AdService,
              private toastController: ToastController,
              private authService: AuthService) {
    addIcons({arrowBack})
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      category: [this.ad.category, Validators.required],
      title: [this.ad.title, [Validators.required, Validators.maxLength(60), Validators.minLength(5)]],
      description: [this.ad.description, [Validators.required, Validators.maxLength(3000)]],
      price: [this.ad.price, Validators.required],
      phone: [this.ad.phone, [Validators.required, Validators.pattern('^\\d{3}/\\d{3}-\\d{3}$')]],
      images: [this.ad.images]
    });

    this.images = this.ad.images;
  }

  dismiss() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }


}

import {Component, inject, OnInit} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent, IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel, IonList,
  IonRadio,
  IonRadioGroup,
  IonRow, IonSelect, IonSelectOption, IonText, IonTextarea,
  IonTitle,
  IonToolbar,
  ModalController
} from "@ionic/angular/standalone";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AdService} from "../../services/ad.service";

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
    ReactiveFormsModule,
    IonRadioGroup,
    IonRadio,
    IonLabel,
    IonRow,
    IonCol,
    IonText,
    IonList,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonGrid
  ],
})
export class AddProductModalComponent implements OnInit {
  private _adService = inject(AdService);

  form: FormGroup;

  constructor(private modalCtrl: ModalController) {
    this.form = new FormGroup({
      buyOrSell: new FormControl('buy', Validators.required),
      title: new FormControl('Prodavam Pcenka vo zrno - Продавам Пченка во зрно', Validators.required),
      city: new FormControl('Kumanovo', Validators.required),
      price: new FormControl('12', Validators.required),
      currency: new FormControl('mkd', Validators.required),
      phone: new FormControl('070123123', Validators.required),
      quantity: new FormControl('5', Validators.required),
      measure: new FormControl('ton', Validators.required),
      description: new FormControl('Se prodava pcenka orginal', Validators.required),
      images: new FormControl([]),
      // buyOrSell: new FormControl('buy', Validators.required),
      // title: new FormControl('', Validators.required),
      // city: new FormControl('', Validators.required),
      // price: new FormControl('', Validators.required),
      // currency: new FormControl('den', Validators.required),
      // phone: new FormControl('', Validators.required),
      // quantity: new FormControl('', Validators.required),
      // measure: new FormControl('kg', Validators.required),
      // description: new FormControl('', Validators.required),
      // images: new FormControl([]),
    });
  }

  ngOnInit() {
  }


  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  submit() {
    this._adService.createAd(this.form.value);
    // return this.modalCtrl.dismiss(this.form.value, 'confirm');
  }

  protected readonly screen = screen;
}

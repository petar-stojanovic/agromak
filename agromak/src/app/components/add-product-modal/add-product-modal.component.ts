import {Component, OnInit} from '@angular/core';
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
  buyOrSell: any;

  form: FormGroup;

  constructor(private modalCtrl: ModalController) {
    this.form = new FormGroup({
      buyOrSell: new FormControl('buy', Validators.required),
      title: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      currency: new FormControl('den', Validators.required),
      phone: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      measure: new FormControl('kg', Validators.required),
      description: new FormControl('', Validators.required),
      images: new FormControl([]),
    });
  }

  ngOnInit() {
  }


  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.form.value, 'confirm');
  }

  protected readonly screen = screen;
}

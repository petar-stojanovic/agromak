import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ModalController
} from "@ionic/angular/standalone";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AdService} from "../../services/ad.service";
import {NgForOf, NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {JsonFormData} from "../../shared/interfaces/json-form-data";
import {JsonFormComponent} from "../../shared/components/json-form/json-form.component";

@Component({
  selector: 'app-add-product-from-json-modal',
  templateUrl: './add-product-from-json-modal.component.html',
  styleUrls: ['./add-product-from-json-modal.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    IonGrid,
    FormsModule,
    NgIf,
    NgForOf,
    IonIcon,
    JsonFormComponent
  ],
})
export class AddProductFromJsonModalComponent implements OnInit {

  formData!: JsonFormData;

  constructor(private http: HttpClient,
              private modalCtrl: ModalController) {

  }

  ngOnInit() {
    this.http
      .get('/assets/form-data.json')
      .subscribe((formData: any) => {
        this.formData = formData;
        console.log(this.formData);
      });

  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }


}

import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
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
  LoadingController,
  ModalController
} from "@ionic/angular/standalone";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {JsonFormData} from "../../shared/models/json-form-data";
import {DynamicFormComponent} from "../../shared/components/dynamic-form/dynamic-form.component";

@Component({
  selector: 'app-add-product-dynamic-modal',
  templateUrl: './add-product-dynamic-modal.component.html',
  styleUrls: ['./add-product-dynamic-modal.component.scss'],
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
    DynamicFormComponent
  ],
})
export class AddProductDynamicModalComponent implements OnInit {

  formData!: JsonFormData;
  isLoading = true;

  constructor(private http: HttpClient,
              private modalCtrl: ModalController,
              private loadingController: LoadingController) {

  }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.http
      .get('/assets/form-data.json')
      .subscribe({
        next: async (formData: any) => {
          this.formData = formData as JsonFormData;
          console.log(this.formData);
        },
        complete: async () => {
          this.isLoading = false
          await loading.dismiss();
        }
      })
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }


}

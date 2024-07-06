import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {LoadingController, ModalController} from "@ionic/angular/standalone";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {JsonFormData} from "../../shared/models/json-form-data";
import {DynamicFormComponent} from "../dynamic-form/dynamic-form.component";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-dynamic-form-modal',
  templateUrl: './dynamic-form-modal.component.html',
  styleUrls: ['./dynamic-form-modal.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgForOf,
    DynamicFormComponent
  ],
})
export class DynamicFormModalComponent implements OnInit {

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
      .get<JsonFormData>('/assets/form-data.json')
      .subscribe({
        next: async (formData) => {
          this.formData = formData;
          console.log(this.formData);
        },
        complete: async () => {
          this.isLoading = false
          await loading.dismiss();
        }
      })
  }

  onFormSubmitted(formValues: any) {
    console.log(formValues);
    //return this.modalCtrl.dismiss(formValues, 'submit');
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPopover,
  IonTitle,
  IonToolbar,
  LoadingController,
  ModalController,
  ToastController
} from "@ionic/angular/standalone";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {JsonFormData} from "../../../shared/models/json-form-data";
import {DynamicFormComponent} from "../dynamic-form/dynamic-form.component";
import {addIcons} from "ionicons";
import {alertCircleOutline} from "ionicons/icons";
import {AdService} from "../../../services/ad.service";
import {CreateDynamicAd} from "../../../shared/models/create-dynamic-ad-";

@Component({
  selector: 'app-dynamic-form-modal',
  templateUrl: './dynamic-form-modal.component.html',
  styleUrls: ['./dynamic-form-modal.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgForOf,
    DynamicFormComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonPopover,
    IonIcon,
    IonBackButton
  ],
})
export class DynamicFormModalComponent implements OnInit {

  formData!: JsonFormData;
  isLoading = true;

  constructor(private http: HttpClient,
              private modalCtrl: ModalController,
              private loadingController: LoadingController,
              private adService: AdService,
              private toastController: ToastController) {
    addIcons({alertCircleOutline})
  }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.http
      .get<JsonFormData>('/assets/default-form.json')
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

  async onFormSubmitted(formValues: CreateDynamicAd) {
    const loading = await this.loadingController.create({
      message: 'Saving Ad, please wait...',
    });
    await loading.present();

    await this.adService.createDynamicAd(formValues);

    await loading.dismiss();
    await this.modalCtrl.dismiss(null, 'success');

    const toast = await this.toastController.create({
      message: 'Ad created successfully',
      duration: 1500,
    });

    await toast.present();
  };

  dismiss() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}

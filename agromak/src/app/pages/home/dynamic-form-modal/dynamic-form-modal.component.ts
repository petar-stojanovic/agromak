import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, input, OnInit} from '@angular/core';
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
import {alertCircleOutline, arrowBack} from "ionicons/icons";
import {AdFetchingService} from "../../../services/ad-fetching.service";
import {CreateDynamicAd} from "../../../shared/models/create-dynamic-ad-";
import {Ad} from "../../../shared/models/ad";
import {UpdateDynamicAd} from "../../../shared/models/update-dynamic-ad-";
import {AdManagementService} from "../../../services/ad-management.service";

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

  @Input()
  ad: Ad | undefined;

  get isEdit() {
    return this.ad !== undefined;
  }

  constructor(private http: HttpClient,
              private modalCtrl: ModalController,
              private loadingController: LoadingController,
              private adFetchingService: AdFetchingService,
              private adManagementService: AdManagementService,
              private toastController: ToastController) {
    addIcons({alertCircleOutline, arrowBack})
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

  async onCreate(formValues: CreateDynamicAd) {
    const loading = await this.loadingController.create({
      message: 'Creating Ad, please wait...',
    });
    await loading.present();

    await this.adManagementService.createDynamicAd(formValues);

    await loading.dismiss();
    await this.modalCtrl.dismiss(null, 'success');

    const toast = await this.toastController.create({
      message: 'Ad created successfully',
      duration: 1500,
    });

    await toast.present();
  };

  async onUpdate(formValues: UpdateDynamicAd) {
    console.log(formValues);

    const loading = await this.loadingController.create({
      message: 'Updating Ad, please wait...',
    });
    await loading.present();
    await this.adManagementService.updateAd(formValues);
    await loading.dismiss();

    const toast = await this.toastController.create({
      message: 'Ad edited successfully',
      duration: 2000,
    });
    await toast.present();
    await this.modalCtrl.dismiss();

  }

  dismiss() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}

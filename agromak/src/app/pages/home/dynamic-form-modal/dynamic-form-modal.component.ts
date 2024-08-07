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
import {AdService} from "../../../services/ad.service";
import {CreateDynamicAd} from "../../../shared/models/create-dynamic-ad-";
import {Ad} from "../../../shared/models/ad";
import {UpdateDynamicAd} from "../../../shared/models/update-dynamic-ad-";

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
              private adService: AdService,
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

  async onUpdate(formValues: UpdateDynamicAd) {
    console.log(formValues);

    const loading = await this.loadingController.create({
      message: 'Saving Ad, please wait...',
    });
    await loading.present();
    await this.adService.updateAd(formValues);
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

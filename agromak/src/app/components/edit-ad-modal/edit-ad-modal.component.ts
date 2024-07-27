import {Component, Input, OnInit} from '@angular/core';
import {Ad} from "../../shared/models/ad";
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
  IonNote,
  IonRow,
  IonTextarea,
  IonTitle,
  IonToolbar,
  LoadingController,
  ModalController,
  ToastController
} from "@ionic/angular/standalone";
import {AdService} from "../../services/ad.service";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {addIcons} from "ionicons";
import {arrowBack, caretDownOutline, closeOutline} from "ionicons/icons";
import {InputErrorComponent} from "../input-error/input-error.component";
import {SelectCategoryModalComponent} from "../select-category-modal/select-category-modal.component";
import {Camera, GalleryPhoto} from "@capacitor/camera";

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
    IonToolbar,
    ReactiveFormsModule,
    InputErrorComponent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    IonNote
  ],
  standalone: true
})
export class EditAdModalComponent implements OnInit {
  @Input() ad!: Ad;
  form!: FormGroup;
  oldImages: string[] = [];
  allImages: Array<string | GalleryPhoto> = [];

  constructor(private fb: FormBuilder,
              private modalCtrl: ModalController,
              private adService: AdService,
              private toastController: ToastController,
              private loadingController: LoadingController,
              private authService: AuthService) {
    addIcons({arrowBack, caretDownOutline, closeOutline})
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

    this.oldImages = this.ad.images ? [...this.ad.images] : [];
    this.allImages = this.ad.images ? this.ad.images : [];
  }

  onSubmit() {
    const data = {
      id: this.ad.id,
      oldImages: this.oldImages,
      ...this.form.value
    }

    return this.modalCtrl.dismiss(data, 'submit');
  }

  async uploadImages() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const images = await Camera.pickImages({
        quality: 90,
      })

      if (images) {
        images.photos.forEach((image) => {
          this.allImages.push(image);

          console.log(image, this.allImages)
        });
        this.form.get('images')!.setValue(this.allImages);
      } else {
        console.log('No images selected')
      }
    } finally {
      await loading.dismiss();
    }
  }


  async openCategoriesModal() {
    const modal = await this.modalCtrl.create({
      component: SelectCategoryModalComponent,
    });
    await modal.present();

    const {data, role} = await modal.onWillDismiss();

    if (data !== undefined) {
      this.form.get('category')!.setValue(data);
    }
  }

  getImageSource(img: string | GalleryPhoto) {
    if (typeof img === 'string') {
      return img;
    }
    return img.webPath;
  }

  formatPhoneNumber(event: any) {
    const input = event.target.value;
    let formattedInput = input.replace(/\D/g, '');

    if (formattedInput.length >= 3) {
      formattedInput = formattedInput.slice(0, 3) + '/' + formattedInput.slice(3);
    }
    if (formattedInput.length >= 7) {
      formattedInput = formattedInput.slice(0, 7) + '-' + formattedInput.slice(7, 10);
    }

    this.form.controls['phone'].setValue(formattedInput);
    this.form.updateValueAndValidity();
  }

  dismiss() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}

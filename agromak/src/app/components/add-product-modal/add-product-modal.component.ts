import {Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
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
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AdService} from "../../services/ad.service";
import {NgForOf, NgIf} from "@angular/common";
import Swiper from "swiper";
import {ImageService} from "../../services/image.service";
import {Camera, GalleryPhoto} from "@capacitor/camera";
import {CreateAd} from "../../interfaces/create-ad";

interface AgriculturalCategories {
  [key: string]: string[];
}


@Component({
  selector: 'app-add-product-modal',
  templateUrl: './add-product-modal.component.html',
  styleUrls: ['./add-product-modal.component.scss'],
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
    NgForOf
  ],
})
export class AddProductModalComponent implements OnInit {
  private _adService = inject(AdService);

  form: FormGroup;
  images: GalleryPhoto[] = [];

  @ViewChild('swiper')
  swiper?: ElementRef<{ swiper: Swiper }>;

  agriculturalCategories: AgriculturalCategories = {
    "Cereal Grains": [
      "Wheat",
      "Corn",
      "Rye",
      "Barley",
      "Oats"
    ],
    "Fruits": [
      "Grapes",
      "Apples",
      "Pears",
      "Peaches",
      "Plums",
      "Cherries"
    ],
    "Vegetables": [
      "Potato",
      "Tomato",
      "Cucumber",
      "Carrot",
      "Onion",
      "Garlic",
      "Cabbage",
      "Lettuce",
      "Pepper",
      "Eggplant",
      "Beans",
      "Peas"
    ],
    "Tropical and Industrial Crops": [
      "Rice",
      "Tobacco",
      "Sunflower",
      "Cotton",
      "Opium",
      "Sesame"
    ],
    "Nuts": [
      "Almond",
      "Peanut",
      "Walnut",
      "Hazelnut",
      "Pistachio",
    ],
  };

  protected readonly Object = Object;


  constructor(private modalCtrl: ModalController,
              private imageService: ImageService,
              private alertController: AlertController,
              private loadingController: LoadingController) {
    this.form = new FormGroup({
      category: new FormControl('', Validators.required),
      subcategory: new FormControl('', Validators.required),
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
    console.log(Object.keys(this.agriculturalCategories))
  }

  ngOnInit() {
    console.log()
  }

  goNext() {
    this.swiper?.nativeElement.swiper.slideNext();
  }

  goPrev() {
    this.swiper?.nativeElement.swiper.slidePrev();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }


  async uploadImages() {
    const images = await Camera.pickImages({
      quality: 90,
    })

    if (images) {

      this.images = [];
      images.photos.forEach((image) => {
        this.images.push(image);
        console.log(image, this.images)
      });
    }
  }


 async submit() {
    const loading = await this.loadingController.create();
    await loading.present();

    this._adService.createAd(this.form.value as CreateAd, this.images).then(async () => {
      await this.modalCtrl.dismiss(this.form.value, 'confirm');
    }).finally(async () => {
        await loading.dismiss();
    });
  }

  getImagePath(item: string): string {
    console.log(item);
    return `assets/images/crops/${item}.png`;
  }

  isCategorySelected(category: string): boolean {
    return this.form.get('category')?.value === category;
  }

  isSubcategorySelected(category: string): boolean {
    return this.form.get('subcategory')?.value === category;
  }


}

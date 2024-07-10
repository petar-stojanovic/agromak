import {Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {
  AlertController,
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
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AdService} from "../../services/ad.service";
import {NgForOf, NgIf} from "@angular/common";
import Swiper from "swiper";
import {ImageService} from "../../services/image.service";
import {Camera, GalleryPhoto} from "@capacitor/camera";
import {CreateAd} from "../../shared/models/create-ad";
import {OpenAiService} from "../../services/open-ai.service";
import {addIcons} from "ionicons";
import {sparklesOutline} from "ionicons/icons";

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
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    IonList,
    IonItem,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonRadioGroup,
    IonGrid,
    IonRow,
    IonCol,
    IonRadio,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonIcon,
    IonInput,
    IonText,
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
              private loadingController: LoadingController,
              private _openAIService: OpenAiService) {

    addIcons({sparklesOutline})

    this.form = new FormGroup({
      category: new FormControl('', Validators.required),
      subcategory: new FormControl('', Validators.required),
      buyOrSell: new FormControl('buy', Validators.required),
      title: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      currency: new FormControl('mkd', Validators.required),
      phone: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      measure: new FormControl('ton', Validators.required),
      description: new FormControl('', Validators.required),
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

    const adId = await this._adService.createAd(this.form.value as CreateAd);
    if (this.images.length > 0) {
      await this.imageService.uploadAdImages(adId, this.images);
    }

    // Dismiss the modal and pass the form value as a result
    await this.modalCtrl.dismiss(this.form.value, 'confirm');
    await loading.dismiss();
  }

  getImagePath(item: string): string {
    return `assets/images/crops/${item}.png`;
  }

  isCategorySelected(category: string): boolean {
    return this.form.get('category')?.value === category;
  }

  isSubcategorySelected(category: string): boolean {
    return this.form.get('subcategory')?.value === category;
  }


  async generateDescription() {
    const {title, category, subcategory, buyOrSell} = this.form.value;

    const stream = await this._openAIService.generateDescriptionForAd(title, category, subcategory, buyOrSell);

    for await (const chunk of stream) {
      const aiResponse = chunk.choices[0].delta.content || '';
      const value = this.form.get('description')?.value;
      this.form.get('description')?.setValue(value + aiResponse);
      this.swiper?.nativeElement.swiper.updateAutoHeight();
      console.log(aiResponse)
    }

    this.swiper?.nativeElement.swiper.updateAutoHeight();
    setTimeout(() => {
      this.swiper?.nativeElement.swiper.updateAutoHeight();
    }, 250)
  }
}

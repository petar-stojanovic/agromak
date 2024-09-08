import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {JsonFormControls, JsonFormData} from "../../../shared/models/json-form-data";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {addIcons} from "ionicons";
import * as icons from "ionicons/icons";
import {
  IonButton,
  IonCheckbox,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRadio,
  IonRadioGroup,
  IonRange,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonToggle,
  LoadingController,
  ModalController
} from "@ionic/angular/standalone";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {InputErrorComponent} from "../../../components/input-error/input-error.component";
import {CategoryService} from "../../../services/category.service";
import {SelectCategoryModalComponent} from "../../../components/select-category-modal/select-category-modal.component";
import {ErrorMessagePipe} from "../../../shared/pipes/error-message.pipe";
import {Camera} from "@capacitor/camera";
import {Ad} from "../../../shared/models/ad";
import {ImageService} from "../../../services/image.service";


@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonItem,
    IonInput,
    IonTextarea,
    IonCheckbox,
    IonToggle,
    IonRange,
    IonIcon,
    IonButton,
    NgIf,
    IonNote,
    InputErrorComponent,
    IonRadioGroup,
    IonList,
    IonLabel,
    IonRadio,
    IonText,
    AsyncPipe,
    IonSelect,
    IonSelectOption,
    NgForOf,
    ErrorMessagePipe,
    IonCol,
    IonGrid,
    IonRow,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input({required: true})
  jsonFormData!: JsonFormData;

  @Input()
  ad: Ad | undefined;

  get isEdit(): boolean {
    return this.ad !== undefined;
  }

  @Output()
  formSubmitted = new EventEmitter<any>();

  chosenCategory = 'Choose Category';
  form: FormGroup;

  images: string[] = [];
  oldImages: string[] = [];

  constructor(private fb: FormBuilder,
              private modalCtrl: ModalController,
              private categoryService: CategoryService,
              private imageService: ImageService,
              private ref: ChangeDetectorRef,
              private loadingController: LoadingController) {
    this.form = this.fb.group({});

    for (const iconName in icons) {
      addIcons({[iconName]: (icons as any)[iconName]});
    }
  }

  ngOnInit() {
    if (this.jsonFormData) {
      this.createForm(this.jsonFormData.controls);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['jsonFormData'] && !changes['jsonFormData'].firstChange) {
      this.createForm(this.jsonFormData.controls);
    }
  }

  createForm(controls: JsonFormControls[]) {
    for (const control of controls) {
      // console.log(control)
      const validatorsToAdd = [];
      for (const [key, value] of Object.entries(control.validators)) {
        switch (key) {
          case 'min':
            validatorsToAdd.push(Validators.min(value));
            break;
          case 'max':
            validatorsToAdd.push(Validators.max(value));
            break;
          case 'required':
            if (value) {
              validatorsToAdd.push(Validators.required);
            }
            break;
          case 'requiredTrue':
            if (value) {
              validatorsToAdd.push(Validators.requiredTrue);
            }
            break;
          case 'email':
            if (value) {
              validatorsToAdd.push(Validators.email);
            }
            break;
          case 'minLength':
            validatorsToAdd.push(Validators.minLength(value));
            break;
          case 'maxLength':
            validatorsToAdd.push(Validators.maxLength(value));
            break;
          case 'pattern':
            validatorsToAdd.push(Validators.pattern(value));
            break;
          case 'nullValidator':
            if (value) {
              validatorsToAdd.push(Validators.nullValidator);
            }
            break;
          default:
            break;
        }
      }

      this.form.addControl(
        control.name,
        this.fb.control(control.value, validatorsToAdd)
      );
    }
    if (this.isEdit) {
      this.updateForm();
      this.images = this.ad!.images ?? [];
      this.oldImages = this.ad!.images ? [...this.ad!.images] : [];
    }
    this.form.updateValueAndValidity();
  }

  onSubmit() {
    const formData = {category: this.chosenCategory, ...this.form.value}
    if (this.isEdit) {
      formData['id'] = this.ad!.id;
      formData['oldImages'] = this.oldImages;
    }

    if (this.form.valid) {
      this.formSubmitted.emit(formData);
    }
  }

  async openCategoriesModal() {
    const modal = await this.modalCtrl.create({
      component: SelectCategoryModalComponent,
    });
    await modal.present();

    const {data, role} = await modal.onWillDismiss();

    if (data !== undefined) {
      this.chosenCategory = data;
      this.form.get('category')!.setValue(data);
    }
    this.ref.markForCheck();
  }

  async uploadImages() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const images = await Camera.pickImages({
        quality: 90,
      })

      if (images) {
        for (const image of images.photos) {
          const img = await this.imageService.readAsBase64(image.path!)
          this.images.push(img);
        }
        this.form.get('images')!.setValue(this.images);
        this.ref.markForCheck();
      } else {
        console.log('No images selected')
      }
    } finally {
      await loading.dismiss();
    }
  }


  formatPhoneNumber(event: any, controlName: string) {
    if (controlName !== 'phone') {
      return;
    }

    const input = event.target.value;
    let formattedInput = input.replace(/\D/g, '');

    if (formattedInput.length >= 3) {
      formattedInput = formattedInput.slice(0, 3) + '/' + formattedInput.slice(3);
    }
    if (formattedInput.length >= 7) {
      formattedInput = formattedInput.slice(0, 7) + '-' + formattedInput.slice(7, 10);
    }

    this.form.controls[controlName].setValue(formattedInput);
    this.form.updateValueAndValidity();
  }


  private updateForm() {
    for (const control of this.jsonFormData.controls) {
      this.updateControlValue(control.name);
    }
  }

  private updateControlValue(name: string) {
    const obj = Object.getOwnPropertyDescriptor(this.ad, name);
    if (!obj) {
      return;
    }
    this.form.controls[name].setValue(obj.value);
  }
}

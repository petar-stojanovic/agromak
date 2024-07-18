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
import {JsonFormControls, JsonFormData} from "../../shared/models/json-form-data";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {addIcons} from "ionicons";
import * as icons from "ionicons/icons";
import {
  IonButton,
  IonCheckbox,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRadio,
  IonRadioGroup,
  IonRange,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonToggle,
  ModalController
} from "@ionic/angular/standalone";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {InputErrorComponent} from "../input-error/input-error.component";
import {CategoryService} from "../../services/category.service";
import {SelectCategoryModalComponent} from "../select-category-modal/select-category-modal.component";
import {ErrorMessagePipe} from "../../shared/pipes/error-message.pipe";
import {AuthService} from "../../services/auth.service";
import {tap} from "rxjs";


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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input({required: true})
  jsonFormData!: JsonFormData;

  @Output()
  formSubmitted = new EventEmitter<any>();

  chosenCategory = 'Choose Category';
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private modalCtrl: ModalController,
              private categoryService: CategoryService,
              private ref: ChangeDetectorRef) {
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
      const validatorsToAdd = [];
      for (const [key, value] of Object.entries(control.validators)) {
        console.log(key, value)
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
      this.form.updateValueAndValidity();
    }
  }

  onSubmit() {
    const formData = {category: this.chosenCategory, ...this.form.value}

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

    console.log(data)
    if (data !== undefined) {
      this.chosenCategory = data;
      this.form.get('category')!.setValue(data);
    }
    this.ref.markForCheck();
  }
}

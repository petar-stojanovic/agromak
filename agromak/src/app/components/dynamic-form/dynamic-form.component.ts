import {
  ChangeDetectionStrategy,
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
  IonItem, IonLabel, IonList, IonNote, IonRadio, IonRadioGroup,
  IonRange, IonText,
  IonTextarea,
  IonToggle
} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";
import {InputErrorComponent} from "../input-error/input-error.component";
import {DomSanitizer} from "@angular/platform-browser";


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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input({required: true})
  jsonFormData!: JsonFormData;

  @Output()
  formSubmitted = new EventEmitter<any>();

  form: FormGroup = this.fb.group({});

  constructor(private fb: FormBuilder,
              protected domSanitizer: DomSanitizer) {
    //add all icons
    for (const iconName in icons) {
      addIcons({[iconName]: (icons as any)[iconName]});
    }
  }

  ngOnInit() {
    // Initial form creation
    if (this.jsonFormData) {
      this.createForm(this.jsonFormData.controls);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Update form on subsequent changes
    if (changes['jsonFormData'] && !changes['jsonFormData'].firstChange) {
      this.createForm(this.jsonFormData.controls);
    }
  }

  createForm(controls: JsonFormControls[]) {
    for (const control of controls) {
      console.log(control)
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
    console.log('Form valid: ', this.form.valid);
    console.log('Form values: ', this.form.value);

    if (this.form.valid) {
      this.formSubmitted.emit(this.form.value);
    }
  }

}

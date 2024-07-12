import {ChangeDetectionStrategy, Component, HostBinding, inject, Input, OnInit} from '@angular/core';
import {ValidationErrors} from "@angular/forms";
import {KeyValue, KeyValuePipe, NgForOf} from "@angular/common";
import {VALIDATION_ERROR_MESSAGES} from "./validation-error-messages.token";
import {IonNote} from "@ionic/angular/standalone";

@Component({
  selector: 'app-input-error',
  template: `
    @for (error of errors | keyvalue; track error.key) {
      <ion-note class="input-error">
        {{ errorsMap[error.key](error.value) }}
      </ion-note>
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    KeyValuePipe,
    NgForOf,
    IonNote,
  ]
})
export class InputErrorComponent {

  @Input()
  errors: ValidationErrors | undefined | null = null;

  @HostBinding('attr.slot') slot = 'error'

  protected errorsMap = inject(VALIDATION_ERROR_MESSAGES)

}

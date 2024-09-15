import {ChangeDetectionStrategy, Component, HostBinding, Input} from '@angular/core';
import {ValidationErrors} from "@angular/forms";
import {KeyValuePipe} from "@angular/common";
import {IonNote} from "@ionic/angular/standalone";
import {ErrorMessagePipe} from "../../pipes/error-message.pipe";

@Component({
  selector: 'app-input-error',
  template: `
    @for (error of errors | keyvalue; track error.key) {
      <ion-note class="input-error">
        {{ error.key | errorMessage:(error.value) }}
      </ion-note>
    }
  `,
  styles: `
    :host {
      position: absolute;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    KeyValuePipe,
    IonNote,
    ErrorMessagePipe,
  ]
})
export class InputErrorComponent {

  @Input()
  errors: ValidationErrors | undefined | null = null;

  @HostBinding('attr.slot') slot = 'error'
}

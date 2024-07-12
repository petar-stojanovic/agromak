import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ValidationErrors} from "@angular/forms";
import {KeyValuePipe} from "@angular/common";

@Component({
  selector: 'app-input-error',
  templateUrl: './input-error.component.html',
  styleUrls: ['./input-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    KeyValuePipe
  ]
})
export class InputErrorComponent  {

  @Input()
  errors: ValidationErrors | null = null;

  constructor() { }


}

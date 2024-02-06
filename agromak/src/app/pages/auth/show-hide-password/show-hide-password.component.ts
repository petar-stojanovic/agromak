import {Component, ContentChild} from '@angular/core';
import {addIcons} from "ionicons";
import {eye, eyeOff} from "ionicons/icons";
import {IonIcon, IonInput} from "@ionic/angular/standalone";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-show-hide-password',
  templateUrl: './show-hide-password.component.html',
  styleUrls: ['./show-hide-password.component.scss'],
  imports: [
    IonIcon,
    NgIf
  ],
  standalone: true
})
export class ShowHidePasswordComponent {

  showPassword = false;
  @ContentChild(IonInput) input!: IonInput;

  constructor() {
    addIcons({eye, eyeOff})
  }

  toggleShow() {
    this.showPassword = !this.showPassword;
    this.input.type = this.showPassword ? 'text' : 'password';
  }
}
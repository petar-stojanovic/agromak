import {Component, ViewChild} from '@angular/core';
import {IonApp, IonRouterOutlet, Platform} from '@ionic/angular/standalone';
import {App} from "@capacitor/app";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  @ViewChild(IonRouterOutlet) outlet!: IonRouterOutlet;

  constructor(private platform: Platform,) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.outlet.canGoBack()) {
        App.exitApp();
      }
    });
  }
}

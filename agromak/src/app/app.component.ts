import {Component, ViewChild} from '@angular/core';
import {IonRouterOutlet, Platform} from '@ionic/angular/standalone';
import {register} from 'swiper/element/bundle';
import {IonicModule} from "@ionic/angular";

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonicModule],
})
export class AppComponent {

  @ViewChild(IonRouterOutlet) outlet!: IonRouterOutlet;

  constructor(private platform: Platform,) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.outlet.canGoBack()) {
        // App.exitApp();
      }
    });
  }
}

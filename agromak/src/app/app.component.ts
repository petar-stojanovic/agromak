import {Component, OnInit, ViewChild} from '@angular/core';
import {IonApp, IonRouterOutlet, Platform} from '@ionic/angular/standalone';
import {register} from 'swiper/element/bundle';
import {FcmService} from "./services/fcm.service";
import {AuthService} from "./services/auth.service";

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet
  ],
})
export class AppComponent implements OnInit {

  @ViewChild(IonRouterOutlet) outlet!: IonRouterOutlet;

  constructor(private platform: Platform,
              private authService: AuthService,
              private fcmService: FcmService) {
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.outlet.canGoBack()) {
        // App.exitApp();
      }
    });
  }

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.fcmService.init();
      }
    })
  }
}

import {Component, EnvironmentInjector, inject} from '@angular/core';
import {addIcons} from 'ionicons';
import {
  chatboxEllipses,
  chatbubbleEllipses,
  chatbubbleEllipsesOutline,
  home,
  homeOutline,
  person,
  personOutline,
  settings,
  sparkles,
  sparklesOutline
} from 'ionicons/icons';
import {IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs} from "@ionic/angular/standalone";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
  ],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({
      home,
      homeOutline,
      chatbubbleEllipses,
      chatbubbleEllipsesOutline,
      chatboxEllipses,
      settings,
      person,
      personOutline,
      sparkles,
      sparklesOutline
    });
  }
}

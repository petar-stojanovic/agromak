import {Component, EnvironmentInjector, inject} from '@angular/core';
import {addIcons} from 'ionicons';
import {home, person, settings, sparkles} from 'ionicons/icons';
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule,],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({home, sparkles, settings, person});
  }
}

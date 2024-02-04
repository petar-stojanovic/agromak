import {Component, inject} from '@angular/core';
import {IonButton, IonContent, IonHeader, IonIcon, IonItem, IonTitle, IonToolbar, LoadingController} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {logOutOutline} from "ionicons/icons";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonButton, IonIcon],
})
export class ProfilePage {
  private _authService = inject(AuthService);

  constructor(private router: Router,
              private loadingController: LoadingController) {

    addIcons({logOutOutline})
  }

  async logOut() {
    const loading = await this.loadingController.create();
    await loading.present();

    this._authService.signOut().finally(() => {
      loading.dismiss();
    });
  }
}

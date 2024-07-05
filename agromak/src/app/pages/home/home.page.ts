import {Haptics, ImpactStyle} from '@capacitor/haptics';
import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular/standalone';
import {AddProductModalComponent} from "../../components/add-product-modal/add-product-modal.component";
import {AdService} from "../../services/ad.service";
import {NgForOf, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {IonicModule, RefresherCustomEvent} from "@ionic/angular";
import {Ad} from "../../shared/models/ad";
import {add} from "ionicons/icons";
import {RouterLink} from "@angular/router";
import {DynamicFormModalComponent} from "../../components/dynamic-form-modal/dynamic-form-modal.component";
import {AdListComponent} from "../../components/ad-list/ad-list.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, NgForOf, NgIf, RouterLink, AdListComponent],
})
export class HomePage implements OnInit {

  ads: Ad[] = [];
  isLoading = true;

  constructor(private modalCtrl: ModalController,
              private _adService: AdService) {
    addIcons({add})
  }

  ngOnInit(): void {
    this.getAds();
    // this.openDynamicModal();
  }

  getAds() {
    this.ads = [];

    this._adService.ads$
      .subscribe(async (ads) => {
        this.ads = ads;
        setTimeout(() => {
          this.isLoading = ads.length === 0;
        }, 1500);
      });

    this._adService.getAds();
  }

  async refreshAds(event: RefresherCustomEvent) {
    this.isLoading = true;
    this._adService.resetAds();

    await Haptics.impact({style: ImpactStyle.Medium});
    await event.target.complete();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddProductModalComponent,
    });
    await modal.present();

    const {data, role} = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('Data:', data);
    }
  }

  async openDynamicModal() {
    const modal = await this.modalCtrl.create({
      component: DynamicFormModalComponent,
    });
    await modal.present();

    const {data, role} = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('Data:', data);
    }
  }


}

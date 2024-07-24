import {Haptics, ImpactStyle} from '@capacitor/haptics';
import {Component, OnInit, ViewChild} from '@angular/core';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonText,
  IonThumbnail,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';
import {AddProductModalComponent} from "./add-product-modal/add-product-modal.component";
import {AdService} from "../../services/ad.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {RefresherCustomEvent} from "@ionic/angular";
import {Ad} from "../../shared/models/ad";
import {add} from "ionicons/icons";
import {RouterLink} from "@angular/router";
import {DynamicFormModalComponent} from "./dynamic-form-modal/dynamic-form-modal.component";
import {AdListComponent} from "../../components/ad-list/ad-list.component";
import {SearchAdsModalComponent} from "./search-ads-modal/search-ads-modal.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [NgForOf, NgIf, RouterLink, AdListComponent, IonHeader, IonToolbar, IonText, IonThumbnail, IonSearchbar, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, AsyncPipe],
})
export class HomePage implements OnInit {

  @ViewChild('searchbar') searchbar!: IonSearchbar;

  ads: Ad[] = [];
  isLoading = true;


  constructor(private modalCtrl: ModalController,
              private adService: AdService) {
    addIcons({add, 'logo': 'assets/logo.svg'})
  }

  ngOnInit(): void {
    this.getAds();
    // this.openDynamicModal();
    setTimeout(() => {
      // this.openSearchModal('Sell');
    }, 1000);

  }

  getAds() {
    this.ads = [];

    this.adService.ads$
      .subscribe(async (ads) => {
        this.ads = ads;
        setTimeout(() => {
          this.isLoading = ads.length === 0;
        }, 500);
      });

    this.adService.getAds();
  }

  async refreshAds(event: RefresherCustomEvent) {
    this.isLoading = true;
    this.adService.resetAds();

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


  search(event: CustomEvent) {
    if (event.detail.value === '') {
      return;
    }
    return this.openSearchModal(event.detail.value);
  }

  // TODO: return to default search function after complete implementation
  private async openSearchModal(searchValue: string) {
    const modal = await this.modalCtrl.create({
      component: SearchAdsModalComponent,
      componentProps: {
        searchValue: searchValue.trim()
      }
    });
    await modal.present();
    this.searchbar.value = null;
  }
}

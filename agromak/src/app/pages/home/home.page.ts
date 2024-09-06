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
import {AdFetchingService} from "../../services/ad-fetching.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {RefresherCustomEvent} from "@ionic/angular";
import {Ad} from "../../shared/models/ad";
import {add} from "ionicons/icons";
import {RouterLink} from "@angular/router";
import {DynamicFormModalComponent} from "./dynamic-form-modal/dynamic-form-modal.component";
import {AdListComponent} from "../../components/ad-list/ad-list.component";
import {SearchAdsModalComponent} from "./search-ads-modal/search-ads-modal.component";
import {AdFetchType} from "../../shared/ad-fetch-type.enum";
import {UserService} from "../../services/user.service";
import {tap} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [NgForOf, NgIf, RouterLink, AdListComponent, IonHeader, IonToolbar, IonText, IonThumbnail, IonSearchbar, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, AsyncPipe],
})
export class HomePage implements OnInit {

  @ViewChild('searchbar') searchbar!: IonSearchbar;

  isLoading = true;
  adFetchType = AdFetchType.ALL;
  lastVisibleAd: Ad | undefined = undefined;

  ads$ = this.adFetchingService.ads$
    .pipe(tap((ads) => {
      this.lastVisibleAd = ads[ads.length - 1];
      // this.shuffleAds(ads);
    }));
  orderDirection: 'asc' | 'desc' = 'desc';

  constructor(private modalCtrl: ModalController,
              private adFetchingService: AdFetchingService,
              private userService: UserService
  ) {
    addIcons({add, 'logo': 'assets/logo.svg'})
  }

  ngOnInit(): void {
    this.getAds();
    // this.openDynamicModal();
    setTimeout(() => {
      this.openSearchModal('prodavam');
    }, 1000);

  }

  getAds() {
    this.adFetchingService.fetchAds(this.adFetchType, {order: this.orderDirection}).pipe(tap(() => this.isLoading = false)).subscribe();
  }

  async refreshAds(event?: RefresherCustomEvent) {
    this.isLoading = true;
    this.adFetchingService.clearAds(this.adFetchType);
    this.getAds();

    await Haptics.impact({style: ImpactStyle.Medium});
    await event?.target.complete();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddProductModalComponent,
    });
    await modal.present();
  }

  async openDynamicModal() {
    const modal = await this.modalCtrl.create({
      component: DynamicFormModalComponent,
    });
    await modal.present();
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
    await this.userService.updateUserSearchHistory(searchValue.trim());
    await modal.onWillDismiss()
    console.log("REFRESHING ADS");
    await this.refreshAds();
    this.searchbar.value = null;
  }

  private shuffleAds(ads: Ad[]) {
    let currentIndex = ads.length;

    while (currentIndex != 0) {

      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [ads[currentIndex], ads[randomIndex]] = [
        ads[randomIndex], ads[currentIndex]];
    }
    return ads;
  }
}

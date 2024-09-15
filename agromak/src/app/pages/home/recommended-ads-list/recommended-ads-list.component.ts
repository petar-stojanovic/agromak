import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  input,
  output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {Ad} from "../../../shared/models/ad";
import {
  AlertController,
  IonBadge, IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle, IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonText,
  IonThumbnail, ModalController
} from "@ionic/angular/standalone";
import Swiper from "swiper";
import {AdDetailsModalComponent} from "../../../shared/components/ad-details-modal/ad-details-modal.component";
import {trashOutline} from "ionicons/icons";
import {addIcons} from "ionicons";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-recommended-ads-list',
  templateUrl: './recommended-ads-list.component.html',
  styleUrls: ['./recommended-ads-list.component.scss'],
  imports: [
    IonBadge,
    IonItem,
    IonLabel,
    IonText,
    IonThumbnail,
    IonCard,
    IonImg,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonIcon,
    IonButton,
  ],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RecommendedAdsListComponent implements AfterViewInit {
  ads = input.required<Ad[]>();
  searchValue = input.required<string>();
  destroy = output<void>();

  @ViewChild('swiper')
  swiper?: ElementRef<{ swiper: Swiper }>;


  constructor(private renderer: Renderer2,
              private modalCtrl: ModalController,
              private userService: UserService,
              private alertController: AlertController
  ) {
    addIcons({trashOutline})
  }

  ngAfterViewInit() {

    this.renderer.setProperty(this.swiper!.nativeElement, 'slidesPerView', 2)
    this.renderer.setProperty(this.swiper!.nativeElement, 'spaceBetween', 5)
    this.renderer.setProperty(this.swiper!.nativeElement, 'autoHeight', false)
  }

  async openAdDetailsModal(ad: Ad) {
    const modal = await this.modalCtrl.create({
      component: AdDetailsModalComponent,
      componentProps: {ad}
    });
    await modal.present();
  }

  async deleteSearchHistory() {
    const alert = await this.alertController.create({
      subHeader: `Are you sure?`,
      buttons: [{
        text: 'Cancel',
        role: 'cancel'
      }, {
        text: 'Delete',
        handler: async () => {
          await this.userService.deleteUserSearchHistory(this.searchValue());
          this.destroy.emit();
        }
      }]
    });
    await alert.present();
  }
}

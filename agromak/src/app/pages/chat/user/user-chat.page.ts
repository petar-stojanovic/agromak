import {AfterViewChecked, Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {UserChatService} from "../../../services/user-chat.service";
import {UserMessage} from "../../../shared/models/chat-room";
import {combineLatest, map, Observable, of, Subscription, switchMap} from "rxjs";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon, IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar, ModalController
} from "@ionic/angular/standalone";
import {MarkdownComponent} from "ngx-markdown";
import {AuthService} from "../../../services/auth.service";
import {ApiService} from "../../../services/api.service";
import {User} from "../../../shared/models/user";
import {Ad} from "../../../shared/models/ad";
import {AdService} from "../../../services/ad.service";
import {AdDetailsModalComponent} from "../../../components/ad-details-modal/ad-details-modal.component";

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.page.html',
  styleUrls: ['./user-chat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonContent, IonFooter, IonIcon, IonInput, IonItem, IonLabel, IonText, IonThumbnail, MarkdownComponent, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonSkeletonText, IonImg]
})
export class UserChatPage implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('content') content!: IonContent;

  ad?: Ad;
  messages: UserMessage[] = [];

  user?: User;
  owner?: User;
  otherUser = this.user || this.owner;

  subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private adService: AdService,
    private chatService: UserChatService,
    private authService: AuthService,
    private modalCtrl: ModalController,
  ) {
    this.authService.user$.subscribe(user => this.user = user);
  }


  ngOnInit() {
    const chatId = this.route.snapshot.paramMap.get('id')!;
    const adId = this.route.snapshot.queryParamMap.get('adId')!;
    const adOwnerId = this.route.snapshot.queryParamMap.get('ownerId')!;

    const messages$ = this.chatService.getChatRoomMessages(chatId);
    const ad$ = this.adService.getAdById(adId);
    const owner$ = this.authService.getUserProfile(adOwnerId);


    this.subscription = combineLatest([messages$, ad$, owner$])
      .subscribe(
        ([messages, ad, owner]) => {
          this.ad = ad;
          this.messages = messages;
          this.owner = owner;
        }
      );
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
  async openAdDetailsModal(ad: Ad) {
    const modal = await this.modalCtrl.create({
      component: AdDetailsModalComponent,
      componentProps: {ad}
    });
    await modal.present();
  }

  private scrollToBottom() {
    if (this.messages.length > 0) {
      this.content.scrollToBottom(100);
    }
  }
}

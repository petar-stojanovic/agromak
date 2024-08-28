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
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {MarkdownComponent} from "ngx-markdown";
import {AuthService} from "../../../services/auth.service";
import {ApiService} from "../../../services/api.service";
import {User} from "../../../shared/models/user";
import {Ad} from "../../../shared/models/ad";
import {AdService} from "../../../services/ad.service";

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.page.html',
  styleUrls: ['./user-chat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonContent, IonFooter, IonIcon, IonInput, IonItem, IonLabel, IonText, IonThumbnail, MarkdownComponent, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonSkeletonText]
})
export class UserChatPage implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('content') content!: IonContent;

  chatId = '';
  user!: User;

  ad!: Ad;
  messages: UserMessage[] = [];
  owner!: User;

  subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private adService: AdService,
    private chatService: UserChatService,
    private authService: AuthService,
    private apiService: ApiService
  ) {
  }


  ngOnInit() {
    this.chatId = this.route.snapshot.paramMap.get('id')!;
    const adId = this.route.snapshot.queryParamMap.get('adId')!;
    const adOwnerId = this.route.snapshot.queryParamMap.get('ownerId')!;

    const messages$ = this.chatService.getChatRoomMessages(this.chatId);
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

  private scrollToBottom() {
    if (this.messages.length > 0) {
      this.content.scrollToBottom(100);
    }
  }
}

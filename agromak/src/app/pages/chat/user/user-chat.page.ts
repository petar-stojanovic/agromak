import {AfterViewChecked, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {UserChatService} from "../../../services/user-chat.service";
import {UserMessage} from "../../../shared/models/chat-room";
import {combineLatest, Subscription} from "rxjs";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  ModalController
} from "@ionic/angular/standalone";
import {MarkdownComponent} from "ngx-markdown";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../shared/models/user";
import {Ad} from "../../../shared/models/ad";
import {AdService} from "../../../services/ad.service";
import {AdDetailsModalComponent} from "../../../components/ad-details-modal/ad-details-modal.component";
import {addIcons} from "ionicons";
import {sendOutline} from "ionicons/icons";

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

  chatId = '';
  user?: User;
  owner?: User;
  otherUser?: User;

  subscription?: Subscription;

  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private adService: AdService,
    private chatService: UserChatService,
    private authService: AuthService,
    private modalCtrl: ModalController,
  ) {
    addIcons({sendOutline});
    this.form = new FormGroup({
      message: new FormControl("", [Validators.required])
    });

    this.authService.user$.subscribe(user => this.user = user);
  }


  ngOnInit() {
    const chatId = this.route.snapshot.paramMap.get('id')!;
    this.chatId = chatId;
    const adId = this.route.snapshot.queryParamMap.get('adId')!;
    const adOwnerId = this.route.snapshot.queryParamMap.get('adOwnerId')!;
    const senderId = this.route.snapshot.queryParamMap.get('senderId')!;

    const messages$ = this.chatService.getChatRoomMessages(chatId);
    const ad$ = this.adService.getAdById(adId);
    const owner$ = this.authService.getUserProfile(adOwnerId);
    const sender$ = this.authService.getUserProfile(senderId);

    this.subscription = combineLatest([messages$, ad$, owner$, sender$])
      .subscribe(
        ([messages, ad, owner, sender]) => {
          this.ad = ad;
          this.messages = messages;
          this.owner = owner;
          console.log(messages);
          this.otherUser = this.user?.uid === owner.id ? sender : owner;
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

  async sendMessage() {
    const {message} = this.form.value;

    await this.chatService.sendMessage(this.chatId, message);
    this.form.reset();
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.messages.length > 0) {
      this.content.scrollToBottom();
    }
  }

  getUser(userId: string): User {
    return this.user?.uid === userId ? this.user : this.otherUser!;
  }

  shouldShowDate(currentMessageIndex: number, messages: UserMessage[]): boolean {
    if (currentMessageIndex === 0) {
      return true;
    }

    const currentMessage = messages[currentMessageIndex];
    const previousMessage = messages[currentMessageIndex - 1];

    const currentDate = new Date(currentMessage.createdAt.seconds * 1000);
    const previousDate = new Date(previousMessage.createdAt.seconds * 1000);

    // Calculate the time difference in minutes
    const diffInMinutes = (currentDate.getTime() - previousDate.getTime()) / (1000 * 60);

    console.log(diffInMinutes);
    console.log(currentDate);
    console.log(previousDate);
    // Return true if the difference is more than 30 minutes
    return diffInMinutes > 30;
  }
}

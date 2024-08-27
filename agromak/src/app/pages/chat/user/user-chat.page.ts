import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {UserChatService} from "../../../services/user-chat.service";
import {UserMessage} from "../../../shared/models/chat-room";
import {Observable} from "rxjs";
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

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.page.html',
  styleUrls: ['./user-chat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonContent, IonFooter, IonIcon, IonInput, IonItem, IonLabel, IonText, IonThumbnail, MarkdownComponent, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonBackButton, IonButtons, IonSkeletonText]
})
export class UserChatPage implements OnInit, AfterViewChecked {

  @ViewChild('content') content!: IonContent;

  chatId = '';

  messages$: Observable<UserMessage[]>;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private chatService: UserChatService
  ) {
    this.messages$ = this.chatService.messages$;
  }


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (!id) {
      this.navCtrl.back();
      return;
    }
    this.chatId = id;
    this.messages$ = this.chatService.getChatRoomMessages(this.chatId);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.messages$) {
      this.content.scrollToBottom(100);
    }
  }
}

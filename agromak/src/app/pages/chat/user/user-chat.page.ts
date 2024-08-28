import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NavController} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';
import {UserChatService} from "../../../services/user-chat.service";
import {UserMessage} from "../../../shared/models/chat-room";
import {combineLatest, map, Observable, of, switchMap} from "rxjs";
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
export class UserChatPage implements OnInit, AfterViewChecked {

  @ViewChild('content') content!: IonContent;

  chatId = '';
  user!: User;

  ad!: Ad;
  messages: UserMessage[] = [];

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
    const owner$ = this.apiService.docDataQuery(`users/${adOwnerId}`);

    const x = combineLatest([messages$, ad$, owner$])
      .subscribe(
        ([messages, ad, owner]) => {
          this.ad = ad;
          this.messages = messages
        }
      );

    // fetch chatRoom

    // get second user from chatRoom.members

    // fetch second user data

    //

    this.authService.user$.pipe(
      switchMap(user => {
        this.user = user;
        return this.apiService.collectionDataQuery(
          'chatRooms',
          this.apiService.whereQuery('members', 'array-contains', user.uid),
        );
      })
    ).pipe(
      map((data: any[]) => {
        data.map((element) => {
          const user_data = element.members.filter((x: string) => x !== this.user.uid);
          element.user$ = this.apiService.docDataQuery(`users/${user_data[0]}`);
          console.log(element);
        })
        return data;
      }),
      switchMap((data) => {
        return of(data)
      })
    )
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    if (this.messages.length > 0) {
      this.content.scrollToBottom(100);
    }
  }
}

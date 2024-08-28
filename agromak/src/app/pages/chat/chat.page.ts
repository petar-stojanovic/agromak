import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonBadge,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {ActivatedRoute, NavigationExtras, Router, RouterLink} from "@angular/router";
import {SegmentCustomEvent} from "@ionic/angular";
import {AiChatService} from "../../services/ai-chat.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../shared/models/user";
import {UserChatService} from "../../services/user-chat.service";
import {ApiService} from "../../services/api.service";
import {combineLatest, map, Observable, Subscription, switchMap, take} from "rxjs";
import {ChatRoom} from "../../shared/models/chat-room";
import {addIcons} from "ionicons";
import {sparkles} from "ionicons/icons";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonBadge, IonItem, IonLabel, IonList, IonSkeletonText, IonText, IonThumbnail, RouterLink, IonImg, IonSegment, IonSegmentButton, IonIcon]
})
export class ChatPage implements OnInit, OnDestroy {
  isLoading = true;
  segment = "userSentChats";

  userSentChats: ChatRoom[] = [];
  userReceivedChats: ChatRoom[] = [];

  user!: User;

  private subscription?: Subscription;

  constructor(private aiChatService: AiChatService,
              private chatService: UserChatService,
              private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService
  ) {
    addIcons({sparkles})
  }

  ngOnInit() {
    this.subscription = this.authService.user$.pipe(
      switchMap((user) => {
        this.user = user;
        return this.loadChatRooms(user.uid);
      }),
      map(([userSentChats, userReceivedChats]) =>
        this.setChatRoomUsers(userSentChats, userReceivedChats)
      ),
    )
      .subscribe(([userSentChats, userReceivedChats]) => {
        this.userSentChats = userSentChats;
        this.userReceivedChats = userReceivedChats;
        console.log(this.userSentChats, this.userReceivedChats);

        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private loadChatRooms(userId: string): Observable<[ChatRoom[], ChatRoom[]]> {
    const userSentChats$ = this.apiService.collectionDataQuery('chatRooms', [
      this.apiService.whereQuery('senderId', '==', userId)
    ], true);

    const userReceivedChats$ = this.apiService.collectionDataQuery('chatRooms', [
      this.apiService.whereQuery('adOwnerId', '==', userId)
    ], true);

    return combineLatest([userSentChats$, userReceivedChats$]);
  }


  private setChatRoomUsers(userSentChats: ChatRoom[], userReceivedChats: ChatRoom[]) {
    userSentChats.forEach(chatRoom => this.fetchUserProfile(chatRoom.adOwnerId, chatRoom));
    userReceivedChats.forEach(chatRoom => this.fetchUserProfile(chatRoom.senderId, chatRoom));
    return [userSentChats, userReceivedChats];
  }

  private fetchUserProfile(userId: string, chatRoom: ChatRoom) {
    this.authService.getUserProfile(userId)
      .pipe(take(1))
      .subscribe(user => chatRoom.userToDisplay = user);
  }

  onSegmentChanged(e: SegmentCustomEvent) {
    this.segment = e.target.value?.toString() || "allChats";
  }

  async navigateToNewAiPage() {
    const id = await this.aiChatService.createChat();
    await this.router.navigate(['ai', id], {relativeTo: this.route});
  }

  async goToChat(chat: ChatRoom) {
    const navData: NavigationExtras = {
      relativeTo: this.route,
      queryParams: {
        adId: chat.adId,
        adOwnerId: chat.adOwnerId,
        senderId: chat.senderId
      }
    }
    await this.router.navigate([chat.id], navData);
  }
}

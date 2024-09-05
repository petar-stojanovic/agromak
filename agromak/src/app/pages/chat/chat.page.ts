import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
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
import {AiChatRoom} from "../../shared/models/ai-chat-room";

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
  aiChats: AiChatRoom[] = [];
  userReceivedChats: ChatRoom[] = [];

  user!: User;

  yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  private subscription?: Subscription;

  constructor(private aiChatService: AiChatService,
              private userChatService: UserChatService,
              private apiService: ApiService,
              private router: Router,
              private ref: ChangeDetectorRef,
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
      map(([userSentChats, aiChats, userReceivedChats]) =>
        this.setChatRoomUsers(userSentChats, aiChats, userReceivedChats)
      ),
    )
      .subscribe(([userSentChats, aiChats, userReceivedChats]) => {
        this.userSentChats = userSentChats as ChatRoom[];
        this.aiChats = aiChats as AiChatRoom[];
        this.userReceivedChats = userReceivedChats as ChatRoom[];
        console.log(this.userSentChats, this.userReceivedChats);
        console.log(aiChats);

        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private loadChatRooms(userId: string): Observable<[ChatRoom[], AiChatRoom[], ChatRoom[]]> {
    const userSentChats$ = this.apiService.collectionDataQuery('chatRooms', [
      this.apiService.whereQuery('senderId', '==', userId)
    ], true).pipe(map(chats => chats.sort((a, b) => b.updatedAt - a.updatedAt)));

    const aiChats$ = this.apiService.collectionDataQuery('aiChatRooms', [
      this.apiService.whereQuery('createdBy', '==', userId)
    ], true).pipe(map(chats => chats.sort((a, b) => b.updatedAt - a.updatedAt)));

    const userReceivedChats$ = this.apiService.collectionDataQuery('chatRooms', [
      this.apiService.whereQuery('adOwnerId', '==', userId)
    ], true).pipe(map(chats => chats.sort((a, b) => b.updatedAt - a.updatedAt)));

    return combineLatest([userSentChats$, aiChats$, userReceivedChats$]);
  }


  private setChatRoomUsers(userSentChats: ChatRoom[], aiChats: AiChatRoom[], userReceivedChats: ChatRoom[]) {
    userSentChats.forEach(chatRoom => this.fetchUserProfile(chatRoom.adOwnerId, chatRoom));
    userReceivedChats.forEach(chatRoom => this.fetchUserProfile(chatRoom.senderId, chatRoom));
    return [userSentChats, aiChats, userReceivedChats];
  }

  private fetchUserProfile(userId: string, chatRoom: ChatRoom) {
    this.authService.getUserProfile(userId)
      .pipe(take(1))
      .subscribe(user => chatRoom.userToDisplay = user);
  }

  onSegmentChanged(e: SegmentCustomEvent) {
    this.segment = e.target.value?.toString() || "userSentChats";
    this.ref.markForCheck();
  }

  async navigateToNewAiPage() {
    const id = await this.aiChatService.createChatRoom();
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

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }
}

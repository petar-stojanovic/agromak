import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonBadge,
  IonContent,
  IonHeader,
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
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {SegmentCustomEvent} from "@ionic/angular";
import {AiChatService} from "../../services/ai-chat.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../shared/models/user";
import {UserChatService} from "../../services/user-chat.service";
import {ApiService} from "../../services/api.service";
import {map, Observable, of, switchMap} from "rxjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonBadge, IonItem, IonLabel, IonList, IonSkeletonText, IonText, IonThumbnail, RouterLink, IonImg, IonSegment, IonSegmentButton]
})
export class ChatPage implements OnInit {

  isLoading = true;
  chats: any;

  segment = "chats";

  chatRooms$!: Observable<any>;

  user!: User;

  constructor(private aiChatService: AiChatService,
              private chatService: UserChatService,
              private apiService: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService
  ) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    })
  }

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
      this.chats = [
        {
          name: "AI",
          photoURL: "assets/logo.svg",
          lastMessage: "Hello there!",
        }
      ]
    }, 1000)

    this.chatRooms$ = this.authService.user$.pipe(
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
          element.user$ = this.apiService.docDataQuery(`users/${user_data[0]}`, true);
          console.log(element);
        })
        return data;
      }),
      switchMap((data) => {
        return of(data)
      })
    )
  }

  onSegmentChanged(e: SegmentCustomEvent
  ) {
    console.log(e.target.value);
    this.segment = e.target.value?.toString() || "chats";
  }


  async navigateToNewAiPage() {
    const id = await this.aiChatService.createChat();
    await this.router.navigate(['ai', id], {relativeTo: this.route});
  }

  async goToChat(chatId: string) {
    await this.router.navigate([chatId], {relativeTo: this.route});
  }

  getUser(user: unknown) {
    return user as User;
  }
}

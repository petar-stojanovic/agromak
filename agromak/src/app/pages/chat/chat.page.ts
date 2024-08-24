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
import {ChatService} from "../../services/chat.service";

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

  constructor(private chatService: ChatService,
              private router: Router,
              private route: ActivatedRoute
  ) {

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
  }

  onSegmentChanged(e
                     :
                     SegmentCustomEvent
  ) {
    console.log(e.target.value);
    this.segment = e.target.value?.toString() || "chats";
  }


  async navigateToNewAiPage() {
    const id = await this.chatService.createChat();
    await this.router.navigate(['ai', id], {relativeTo: this.route});
  }
}

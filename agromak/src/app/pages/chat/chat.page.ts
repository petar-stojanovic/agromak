import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonBadge,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonBadge, IonItem, IonLabel, IonList, IonSkeletonText, IonText, IonThumbnail, RouterLink]
})
export class ChatPage implements OnInit {

  isLoading = true;
  chats: any;
  constructor() {

  }

  ngOnInit() {
    setTimeout(() =>{
      this.isLoading = false;
    }, 3000)
  }

}

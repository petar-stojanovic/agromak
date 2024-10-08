import firebase from "firebase/compat/app";
import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Firestore} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";
import {User} from "../shared/models/user";
import {AiMessage} from '../shared/models/ai-message';
import {Observable, take} from "rxjs";
import {ApiService} from "./api.service";
import {AiChatRoom} from "../shared/models/ai-chat-room";
import {ImageService} from "./image.service";
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class AiChatService {

  user!: User;

  constructor(
    private angularFirestore: AngularFirestore,
    private firestore: Firestore,
    private authService: AuthService,
    private api: ApiService,
    private imageService: ImageService
  ) {

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  async createChatRoom() {

    const dateCreated = new Date();
    const data: AiChatRoom = {
      createdBy: this.user.uid,
      updatedAt: dateCreated as unknown as Timestamp,
      createdAt: dateCreated as unknown as Timestamp,
      lastMessage: {
        from: this.user.uid,
        message: ""
      },
    }
    const aiChatRoom = await this.api.addDocument('aiChatRooms', data);

    return aiChatRoom.id;
  }

  getChat(chatId: string) {
    return this.api.collectionDataQuery(`aiChats/${chatId}/messages`,
      [
        this.api.orderByQuery('createdAt', 'asc')
      ]) as Observable<AiMessage[]>;
  }


  async sendMessage(chatId: string, message: AiMessage) {
    const currentDate = new Date();
    console.log(message);


    let data: AiMessage = {
      from: message.from,
      message: message.message,
      createdAt: currentDate as unknown as Timestamp,
    };

    const messageRef = await this.api.addDocument(`aiChats/${chatId}/messages`, data);
    const messageId = messageRef.id;

    if (message.image) {
      const imageUrl = await this.imageService.uploadAiChatImage(chatId, message.image, messageId);
      if (imageUrl) {
        await this.api.updateDocument(`aiChats/${chatId}/messages/${messageId}`, {image: imageUrl});
      }
    }

    await this.api.updateDocument(`aiChatRooms/${chatId}`, {
      lastMessage: {message: message.message, from: message.from},
      updatedAt: currentDate as unknown as Timestamp
    });
  }

  async deleteAiChatIfEmpty(chatId: string) {
    this.api
      .docDataQuery(`aiChatRooms/${chatId}`)
      .pipe(
        take(1)
      )
      .subscribe((room: AiChatRoom) => {
        console.log(room);
        if (room.lastMessage.message === "") {
          this.api.deleteDocument(`aiChatRooms/${chatId}`);
        }
      });
  }
}

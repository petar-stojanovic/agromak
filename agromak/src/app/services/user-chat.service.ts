import {Injectable} from '@angular/core';
import {ChatService} from "./interfaces/chat-service";
import {Observable} from 'rxjs';
import {User} from "../shared/models/user";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Firestore} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";
import {ApiService} from "./api.service";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;
import {UserChat} from "../shared/models/user-chat";
import {Ad} from "../shared/models/ad";

@Injectable({
  providedIn: 'root'
})
export class UserChatService implements ChatService {
  user!: User;

  constructor(
    private angularFirestore: AngularFirestore,
    private firestore: Firestore,
    private authService: AuthService,
    private api: ApiService
  ) {

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  createChat(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  getChat(chatId: string): Observable<any> {
    throw new Error('Method not implemented.');
  }

  async sendMessage(chatId: string, message: any): Promise<any> {
    console.log(chatId, message);
    try{
      const data = {
        message: message,
        from: this.user.uid,
        createdAt: new Date() as unknown as Timestamp
      }
      await this.api.addDocument(`chats/${chatId}/messages`, data);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  deleteChat(chatId: string): void {
    throw new Error('Method not implemented.');
  }

  async createChatRoom(userId: string, ad: Ad) {
    try {
      let room: any;
      const querySnapshot = await this.api.getDocs(
        'chatRooms',
        [
          this.api.whereQuery('members', 'in', [[this.user.uid, userId], [userId, this.user.uid]]),
          this.api.whereQuery('adId', '==', ad.id)
        ]
      );

      room = querySnapshot.docs.map((doc: any) => {
        return {id: doc.id, ...doc.data()};
      });

      console.log("existing room", room);

      if (room.length > 0) {
        return room[0].id;
      }

      const dateCreated = new Date();
      const data: UserChat = {
        members: [
          this.user.uid,
          userId
        ],
        updatedAt: dateCreated as unknown as Timestamp,
        createdAt: dateCreated as unknown as Timestamp,
        adId: ad.id,
        adTitle: ad.title,
        lastMessage: ''
      }
      room = await this.api.addDocument('chatRooms', data);
      console.log("new room", room);

      return room.id;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}


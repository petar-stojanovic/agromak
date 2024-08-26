import {Injectable} from '@angular/core';
import {ChatService} from "./interfaces/chat-service";
import {Observable} from 'rxjs';
import {User} from "../shared/models/user";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Firestore} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";
import {ApiService} from "./api.service";
import {UserChat} from "../shared/models/user-chat";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

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

  sendMessage(chatId: string, message: any): Promise<any> {
    throw new Error('Method not implemented.');
  }

  deleteChat(chatId: string): void {
    throw new Error('Method not implemented.');
  }

  async createChatRoom(userId: string) {
    try {
      let room: any;
      const querySnapshot = await this.api.getDocs(
        'chatRooms',
        this.api.whereQuery(
          'members',
          'in',
          [[this.user.uid, userId], [userId, this.user.uid]]
        )
      );

      room = querySnapshot.docs.map((doc: any) => {
        return {id: doc.id, ...doc.data()};
      });

      console.log("existing room", room);

      if (room.length > 0) {
        return room[0];
      }

      const dateCreated = new Date();
      const data: UserChat = {
        members: [
          this.user.uid,
          userId
        ],
        messages: [],
        updatedAt: dateCreated as unknown as Timestamp,
        createdAt: dateCreated as unknown as Timestamp,
      }
      room = await this.api.addDocument('chatRooms', data);
      return room;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}


import {Injectable} from '@angular/core';
import {User} from "../shared/models/user";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Firestore} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";
import {ApiService} from "./api.service";
import firebase from "firebase/compat";
import {ChatRoom} from "../shared/models/chat-room";
import {Ad} from "../shared/models/ad";
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root'
})
export class UserChatService {
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


  async sendMessage(chatId: string, message: any): Promise<any> {
    console.log(chatId, message);
    const data = {
      message: message,
      from: this.user.uid,
      createdAt: new Date() as unknown as Timestamp
    }
    await this.api.addDocument(`chats/${chatId}/messages`, data);
  }

  async createChatRoom(ad: Ad) {
    let room: any;
    const querySnapshot = await this.api.getDocs(
      'chatRooms',
      [
        this.api.whereQuery('members', 'in', [[this.user.uid, ad.ownerId], [ad.ownerId, this.user.uid]]),
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
    const data: ChatRoom = {
      members: [
        this.user.uid,
        ad.ownerId
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
  }
}

import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {doc, Firestore, updateDoc} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";
import {User} from "../shared/models/user";
import {Message} from '../shared/models/message';
import firebase from "firebase/compat/app";
import FieldValue = firebase.firestore.FieldValue;
import {take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  user!: User;

  constructor(
    private angularFirestore: AngularFirestore,
    private firestore: Firestore,
    private authService: AuthService
  ) {

    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }


  async createChat() {
    const newChatRef = await this.angularFirestore.collection('chatgpt').add({
      createdBy: this.user.uid,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const userDocRef = doc(this.firestore, `users/${this.user.uid}`);
    await updateDoc(userDocRef, {
      aiChats: FieldValue.arrayUnion(newChatRef.id)
    });
    return newChatRef.id;
  }

  async updateChat(chatId: string, message: Message) {

    console.log(message)
    const data = {
      ...message,
      createdAt: new Date()
    };

    const chatDocRef = doc(this.firestore, `chatgpt/${chatId}`);
    await updateDoc(chatDocRef, {
      messages: FieldValue.arrayUnion(data),
      updatedAt: new Date()
    });
  }

  deleteChatIfEmpty(chatId: string) {
    const chatDocRef = this.angularFirestore.collection('chatgpt').doc(chatId);

    chatDocRef.get()
      .pipe(
        take(1)
      )
      .subscribe(async chatData => {
        if (chatData.exists) {
          const data: any = chatData.data();
          if (data && data.messages.length === 0) {
            await chatDocRef.delete();
            const userDocRef = doc(this.firestore, `users/${this.user.uid}`);
            await updateDoc(userDocRef, {
              aiChats: FieldValue.arrayRemove(chatId)
            });
          }
        }
      })

  }
}

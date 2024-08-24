import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {doc, Firestore, updateDoc} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";
import {User} from "../shared/models/user";
import {Message} from '../shared/models/message';
import firebase from "firebase/compat/app";
import FieldValue = firebase.firestore.FieldValue;

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
      createdAt: new Date(),
      createdBy: this.user.uid,
      messages: []
    });
    return newChatRef.id;
  }

  async updateChat(chatId: string, message: Message) {

    console.log(message)
    const data = {
      ...message,
      userId: this.user.uid,
      createdAt: new Date(),
    };


    if (chatId) {
      const chatDocRef = doc(this.firestore, `chatgpt/${chatId}`);
      await updateDoc(chatDocRef, {
        messages: FieldValue.arrayUnion(data),
        updatedAt: FieldValue.serverTimestamp()
      });
      return;
    } else {
      const newChatRef = this.angularFirestore.collection('chatgpt').doc();
      await newChatRef.set({
        userId: this.user.uid,
        messages: [data],
        createdAt: new Date(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      return newChatRef.ref.id;
    }
  }

  deleteChatIfEmpty(chatId: string) {
    const chatDocRef = this.angularFirestore.collection('chatgpt').doc(chatId);

    chatDocRef.get().subscribe(async chatData => {
      if (chatData.exists) {
        const data: any = chatData.data();
        if (data && data.messages.length === 0) {
          console.log("EMPTY", data);
          await chatDocRef.delete();
        }
      }
    })

  }
}

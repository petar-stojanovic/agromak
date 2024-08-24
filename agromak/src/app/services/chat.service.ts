import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {doc, Firestore, updateDoc} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";
import {User} from "../shared/models/user";
import {Message} from '../shared/models/message';
import firebase from "firebase/compat/app";
import FieldValue = firebase.firestore.FieldValue;
import {of, switchMap, take} from "rxjs";
import {Chat} from "../shared/models/chat";

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


  async createAiChat() {
    const currentDate = new Date();
    const newChatRef = await this.angularFirestore.collection('chatgpt').add({
      createdBy: this.user.uid,
      messages: [],
      createdAt: currentDate,
      updatedAt: currentDate
    });

    const userDocRef = doc(this.firestore, `users/${this.user.uid}`);
    await updateDoc(userDocRef, {
      aiChats: FieldValue.arrayUnion({
        id: newChatRef.id,
        lastMessage: '',
        updatedAt: currentDate
      })

    });
    return newChatRef.id;
  }

  getChat(chatId: string) {
    return this.angularFirestore.collection<Chat>('chatgpt').doc(chatId).valueChanges()
      .pipe(
        take(1)
      );
  }

  async updateChat(chatId: string, message: Message) {
    const currentDate = new Date();

    const data = {
      ...message,
      createdAt: currentDate
    };

    const chatDocRef = doc(this.firestore, `chatgpt/${chatId}`);
    await updateDoc(chatDocRef, {
      messages: FieldValue.arrayUnion(data),
      updatedAt: currentDate
    });

    if (message.from === 'AI') {
      const userDocRef = doc(this.firestore, `users/${this.user.uid}`);
      await updateDoc(userDocRef, {
        aiChats: FieldValue.arrayUnion({
          id: chatId,
          lastMessage: message.message,
          updatedAt: currentDate
        })
      });
    }
  }

  deleteAiChatIfEmpty(chatId: string) {
    const chatDocRef = this.angularFirestore.collection('chatgpt').doc(chatId);

    chatDocRef.get()
      .pipe(
        take(1)
      )
      .subscribe(async chatData => {
        if (chatData.exists) {
          const data: any = chatData.data();
          console.log(data)

          if (data && data.messages.length === 0) {
            await chatDocRef.delete();

            const userDocRef = doc(this.firestore, `users/${this.user.uid}`);

            const objToDelete = {
              id: chatId,
              lastMessage: '',
              updatedAt: data.createdAt
            }
            console.log(objToDelete)

            await updateDoc(userDocRef, {
              aiChats: FieldValue.arrayRemove(objToDelete)
            });
          }
        }
      })

  }
}

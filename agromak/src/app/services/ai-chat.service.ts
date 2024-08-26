import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {doc, Firestore, updateDoc} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";
import {User} from "../shared/models/user";
import {AiMessage} from '../shared/models/ai-message';
import firebase from "firebase/compat/app";
import {take} from "rxjs";
import {AiChat} from "../shared/models/ai-chat";
import {ChatService} from "./interfaces/chat-service";
import FieldValue = firebase.firestore.FieldValue;

@Injectable({
  providedIn: 'root'
})
export class AiChatService implements ChatService {

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
    return this.angularFirestore.collection<AiChat>('chatgpt').doc(chatId).valueChanges()
      .pipe(
        take(1)
      );
  }

  async sendMessage(chatId: string, message: AiMessage) {
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
      const userDocRef = this.angularFirestore.doc(`users/${this.user.uid}`);

      userDocRef.get().subscribe(userDoc => {
        const userDocData: any = userDoc.data();
        if (userDocData && userDocData.aiChats) {
          userDocData.aiChats.forEach((chat: any) => {
            if (chat.id === chatId) {
              const objToDelete = {...chat};
              userDocRef.update({
                aiChats: FieldValue.arrayRemove(objToDelete)
              },)
            }
          });
        }

        userDocRef.update({
          aiChats: FieldValue.arrayUnion({
            id: chatId,
            lastMessage: message.message,
            updatedAt: currentDate
          })
        })
      })


    }
  }

  async deleteChat(chatId: string) {
    await this.angularFirestore.collection('chatgpt').doc(chatId).delete();
  }


  deleteAiChatIfEmpty(chatId: string) {
    const chatDocRef = this.angularFirestore.collection('chatgpt').doc(chatId);

    chatDocRef.get()
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

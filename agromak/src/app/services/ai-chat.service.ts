import firebase from "firebase/compat/app";
import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {doc, Firestore, updateDoc} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";
import {User} from "../shared/models/user";
import {AiMessage} from '../shared/models/ai-message';
import {take} from "rxjs";
import {AiChat} from "../shared/models/ai-chat";
import {ApiService} from "./api.service";
import {AiChatRoom} from "../shared/models/ai-chat-room";
import Timestamp = firebase.firestore.Timestamp;
import FieldValue = firebase.firestore.FieldValue;
import {UserMessage} from "../shared/models/chat-room";

@Injectable({
  providedIn: 'root'
})
export class AiChatService {

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

  async createChatRoom() {

    const dateCreated = new Date();
    const data: AiChatRoom = {
      id: "",
      createdBy: "",
      updatedAt: dateCreated as unknown as Timestamp,
      createdAt: dateCreated as unknown as Timestamp,
      lastMessage: "",
    }
    const aiChatRoom = await this.api.addDocument('aiChatRooms', data);
    console.log("new aiChatRoom", aiChatRoom);

    return aiChatRoom.id;
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

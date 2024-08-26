import {Injectable} from '@angular/core';
import {ChatService} from "./interfaces/chat-service";
import {Observable} from 'rxjs';
import {User} from "../shared/models/user";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Firestore} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserChatService implements ChatService {
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
}


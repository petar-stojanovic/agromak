import {Observable} from "rxjs";

export interface ChatService {
  createChat(): Promise<any>;
  getChat(chatId: string): Observable<any>;
  sendMessage(chatId: string, message: any): Promise<any>;
  deleteChat(chatId: string): void;
}

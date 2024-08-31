import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;
import {AiMessage} from "./ai-message";

export interface AiChatRoom {
  id?: string;
  createdBy: string;
  updatedAt: Timestamp;
  createdAt: Timestamp;
  lastMessage: AiMessage;
}



import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface AiChatRoom {
  id?: string;
  createdBy: string;
  updatedAt: Timestamp;
  createdAt: Timestamp;
  lastMessage: string;
}


import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface ChatRoom {
  id?: string;
  adId: string;
  adTitle: string;
  adOwnerId: string;
  senderId: string;
  updatedAt: Timestamp;
  createdAt: Timestamp;
  lastMessage: string;
}

export interface UserMessage {
  from: string;
  message: string;
  createdAt: Timestamp;
}


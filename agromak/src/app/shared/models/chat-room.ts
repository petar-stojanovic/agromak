import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface ChatRoom {
  members: string[];
  adId: string;
  adTitle: string;
  lastMessage: string;
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

export interface UserMessage {
  from: string;
  message: string;
  createdAt: Timestamp;
}


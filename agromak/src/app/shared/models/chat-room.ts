import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;
import {User} from "./user";

export interface ChatRoom {
  id?: string;
  adId: string;
  adTitle: string;
  adOwnerId: string;
  senderId: string;
  updatedAt: Timestamp;
  createdAt: Timestamp;
  lastMessage: string;
  userToDisplay?: User;
}

export interface UserMessage {
  from: string;
  message: string;
  createdAt: Timestamp;
  shouldShowDate?: boolean; // Used to display date in chat
}


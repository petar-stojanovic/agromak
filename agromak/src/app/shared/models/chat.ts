import {Message} from "./message";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Chat {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

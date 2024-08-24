import {Message} from "./message";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Chat {
  createdBy: string;
  messages: Message[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

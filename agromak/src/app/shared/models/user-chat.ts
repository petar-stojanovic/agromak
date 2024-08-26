import {UserMessage} from "./user-message";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface UserChat {
  id: string;
  members: string[];
  messages: UserMessage[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

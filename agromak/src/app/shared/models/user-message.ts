import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface UserMessage {
  from: string;
  message: string;
  createdAt?: Timestamp;
}

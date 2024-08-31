import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface AiMessage {
  from: string;
  message: string;
  image: string | null;
  createdAt?: Timestamp;
}


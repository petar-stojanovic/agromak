import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface UserChat {
  members: string[];
  adId: string;
  adTitle: string;
  lastMessage: string;
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

interface UserMessage {
  from: string;
  message: string;
  createdAt?: Timestamp;
}


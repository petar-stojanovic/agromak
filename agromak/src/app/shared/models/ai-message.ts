import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface AiMessage {
  from: MessageType;
  message: string;
  image: string | null;
  createdAt?: Timestamp;
}

type MessageType = "YOU" | "AI";
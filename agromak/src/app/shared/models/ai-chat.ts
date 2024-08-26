import {AiMessage} from "./ai-message";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface AiChat {
  createdBy: string;
  messages: AiMessage[];
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

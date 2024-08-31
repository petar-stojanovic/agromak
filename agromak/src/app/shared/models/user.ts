import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAnonymous?: boolean;
  emailVerified?: boolean;
  phoneNumber?: string;
  refreshToken?: string;
  favoriteAds: string[];
  city?: string;
  createdAt: number;
}

interface UserAiChatDetails {
  id: string;
  lastMessage: string;
  updatedAt: Timestamp;
}

import firebase from "firebase/compat/app";
import Timestamp = firebase.firestore.Timestamp;

export interface UserSearchHistory {
  searchHistory: SearchHistory[]
}

export interface SearchHistory {
  searchValue: string;
  count: number;
  timestamp: Timestamp;
}

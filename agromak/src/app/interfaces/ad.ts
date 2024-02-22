import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Ad {
  id: string;
  buyOrSell: string;
  title: string;
  city: string;
  price: number;
  currency: string;
  phone: string;
  quantity: number;
  measure: string;
  description: string;
  images: string[];
  ownerId: string;
  ownerName?: string;
  uploadedAt: Timestamp;
}

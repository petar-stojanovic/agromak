import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export interface Ad {
  id: string;
  title: string;
  title_lowercase: string;
  location: string;
  price: number;
  currency: string;
  phone: string;
  description: string;
  category: string;
  subCategory: string;
  images: string[];
  ownerId: string;
  ownerName?: string;
  fixedPrice: boolean;
  itemCondition: string;
  viewCount: number;
  uploadedAt: Timestamp;
  keywords?: string[];
}

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
  phone?: string;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAnonymous?: boolean;
  emailVerified?: boolean;
  phoneNumber?: string;
  refreshToken?: string;
}

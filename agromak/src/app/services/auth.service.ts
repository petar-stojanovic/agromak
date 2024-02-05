import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Observable, of, switchMap} from "rxjs";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {User} from "../interfaces/user";
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import {getAuth, GoogleAuthProvider, signInWithCredential} from "firebase/auth";


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  user$: Observable<User | undefined | null>;

  constructor(private afAuth: AngularFireAuth,
              private firestore: AngularFirestore,
              private router: Router) {

    GoogleAuth.initialize();

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async register(email: string, password: string) {
    return await this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async login(email: string, password: string) {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async signInWithGoogle() {
    const user = await GoogleAuth.signIn();
    if (user) {
      const result = await signInWithCredential(getAuth(), GoogleAuthProvider.credential(user.authentication.idToken));
      if (result) {
        return this.updateUserData(result.user as User);
      }
    }
  }


  private updateUserData(user: User | null) {
    if (user) {
      const userRef: AngularFirestoreDocument<User> = this.firestore.doc(`users/${user.uid}`);
      const data = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAnonymous: user.isAnonymous,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        refreshToken: user.refreshToken,
      };
      return userRef.set(data, {merge: true});
    } else {
      return Promise.reject("User is null");
    }
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/login']);
  }

  async getProfile() {
    // return this.afAuth.user;
  }
}

import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {fromEvent, Observable, of, startWith, switchMap} from "rxjs";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {User} from "../interfaces/user";
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import {getAuth, GoogleAuthProvider, signInWithCredential} from "firebase/auth";
import {doc, docData, Firestore} from "@angular/fire/firestore";
import {Auth} from "@angular/fire/auth";


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  user$: Observable<User | undefined | null>;

  constructor(private afAuth: AngularFireAuth,
              private angularFirestore: AngularFirestore,
              private auth: Auth,
              private firestore: Firestore,
              private router: Router) {

    GoogleAuth.initialize();

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.angularFirestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  onAuthStateChanged(): Observable<User | null> {
    return this.afAuth.authState.pipe(
      startWith(undefined),
      switchMap(() => this.getUserProfile())
    );
  }


  async register(email: string, password: string, displayName: string) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);

    return this.updateUserData(userCredential.user as User, {displayName});
  }

  async login(email: string, password: string) {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async signUpWithGoogle() {
    const user = await GoogleAuth.signIn();
    if (user) {
      const userCredential = await signInWithCredential(getAuth(), GoogleAuthProvider.credential(user.authentication.idToken));
      if (userCredential) {
        return this.updateUserData(userCredential.user as User);
      }
    }
  }

  private updateUserData(user: User | null, additionalData: any = {}) {
    if (user) {
      const userRef: AngularFirestoreDocument<User> = this.angularFirestore.doc(`users/${user.uid}`);
      const data = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAnonymous: user.isAnonymous,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        refreshToken: user.refreshToken,
        ...additionalData
      };
      return userRef.set(data, {merge: true});
    } else {
      return Promise.reject("User is null");
    }
  }

  async signOut() {
    await this.afAuth.signOut().finally(() => {
      this.router.navigate(['/login']);
    });
  }

  getUserProfile(): Observable<User | null> {
    const user = this.auth.currentUser as User;
    if (user === null) {
      return of(null);
    }
    const userDocRef = doc(this.firestore, `users/${user.uid}`)
    return docData(userDocRef) as Observable<User>;
  }

}

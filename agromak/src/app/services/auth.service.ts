import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {first, map, Observable, of, switchMap} from "rxjs";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {User} from "../shared/models/user";
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';
import {getAuth, GoogleAuthProvider, signInWithCredential} from "firebase/auth";
import {doc, Firestore, updateDoc} from "@angular/fire/firestore";
import {Auth} from "@angular/fire/auth";


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  user$: Observable<User | null>;

  constructor(private afAuth: AngularFireAuth,
              private angularFirestore: AngularFirestore,
              private auth: Auth,
              private firestore: Firestore,
              private router: Router) {

    GoogleAuth.initialize();

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.angularFirestore.doc<User>(`users/${user.uid}`)
            .valueChanges()
            .pipe(
              map(userData => userData || null)
            );
        } else {
          return of(null);
        }
      })
    );
  }


  async register(email: string, password: string, displayName: string) {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);

    return this.updateUserData(userCredential.user, {displayName});
  }

  async login(email: string, password: string) {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async signInWithGoogle() {
    const user = await GoogleAuth.signIn();
    if (user) {
      const userCredential = await signInWithCredential(getAuth(), GoogleAuthProvider.credential(user.authentication.idToken));
      if (userCredential) {

        const userRef = this.angularFirestore.doc(`users/${userCredential.user.uid}`);
        userRef.get().subscribe((data) => {
          if (data.exists) {
            console.log("USER REF DATA -", data);
            return of(null)
          } else {
            return this.updateUserData(userCredential.user);
          }
        });
      }
    }
  }

  private updateUserData(user: any, additionalData: any = {}) {
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
        favoriteAds: [],
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

  updateUser(value: { displayName: string, city: string, phoneNumber: string })  {
    this.user$
      .pipe(first())
      .subscribe(async (user) => {
        if (user) {
          const userDocRef = doc(this.firestore, `users/${user.uid}`)
          await updateDoc(userDocRef, {
              displayName: value.displayName,
              city: value.city,
              phoneNumber: value.phoneNumber
            }
          );
        }
      });

  }

  getUserProfile(userId: string){
    return this.angularFirestore.doc(`users/${userId}`).valueChanges()
  }
}

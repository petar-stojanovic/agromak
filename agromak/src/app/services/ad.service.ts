import {inject, Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Auth} from "@angular/fire/auth";
import {Firestore} from "@angular/fire/firestore";
import {Router} from "@angular/router";
import {User} from "../interfaces/user";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AdService {
  private _authService = inject(AuthService);

  constructor(private afAuth: AngularFireAuth,
              private angularFirestore: AngularFirestore,
              private auth: Auth,
              private firestore: Firestore,
              private router: Router) {
  }

  createAd(value: any) {
    // const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(`ads/${user.uid}`);
    //
    //
    // return this.angularFirestore.collection('ads').add(value);
  }
}

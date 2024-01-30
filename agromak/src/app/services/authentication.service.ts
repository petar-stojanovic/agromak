import {Injectable} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "@angular/fire/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(public auth: Auth) {
  }

  async register(email: string, password: string) {
    try {
      return await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      return null
    }
  }

  async login(email: string, password: string) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      return null
    }
  }

  async signOut() {
    return this.auth.signOut();
  }

  async getProfile() {
  }
}

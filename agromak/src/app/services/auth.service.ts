import {Injectable} from '@angular/core';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "@angular/fire/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {
  }

  async register(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  async signOut() {
    return await this.auth.signOut();
  }

  async getProfile() {
    return this.auth.currentUser;
  }
}

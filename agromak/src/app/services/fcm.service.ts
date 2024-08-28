import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AuthService} from "./auth.service";
import {User} from "../shared/models/user";
import {ApiService} from "./api.service";

@Injectable()
export class FcmService {

  user!: User;

  constructor(
    private angularFirestore: AngularFirestore,
    private authService: AuthService,
    private apiService: ApiService,
  ) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  async saveToken(token: string) {
    const data = {
      token,
      userId: this.user.uid,
    }
    await this.apiService.setDocument(`devices/${token}`, data);
  }

}


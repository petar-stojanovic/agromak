import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AuthService} from "./auth.service";
import {User} from "../shared/models/user";
import {ApiService} from "./api.service";
import {Capacitor} from "@capacitor/core";
import {PushNotifications} from "@capacitor/push-notifications";
import {StorageService} from "./storage.service";
import firebase from "firebase/compat/app";
import FieldValue = firebase.firestore.FieldValue;

export const FCM_TOKEN = 'push_notification_token';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  user!: User;

  constructor(
    private angularFirestore: AngularFirestore,
    private authService: AuthService,
    private apiService: ApiService,
    private storageService: StorageService
  ) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  init() {
    if (Capacitor.getPlatform() !== "web") {
      this.registerPush();
    }
  }

  private async registerPush() {
    await this.addListeners();

    let permStatus = await PushNotifications.requestPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.error('Permission not granted');
      return;
    }

    await PushNotifications.register();
  }


  private async addListeners() {
    await PushNotifications.addListener(
      'registration', async token => {
        const fcmToken = token.value;
        this.storageService.removeStorage(FCM_TOKEN);
        const savedToken = (await this.storageService.getStorage(FCM_TOKEN)).value;

        if (fcmToken === savedToken) {
          return;
        }

        await this.saveToken(fcmToken);
      }
    );

    await PushNotifications.addListener('registrationError', err => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener('pushNotificationReceived', notification => {
      console.log('Push notification received: ', notification);
    });

    await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
      console.log('Push notification action performed', notification.actionId, notification.inputValue);
    });
  }

  private async saveToken(token: string) {
    const data = {
      token,
      timestamp: FieldValue.serverTimestamp()
    };

    this.storageService.setStorage(FCM_TOKEN, token);
    await this.apiService.setDocument(`fcmTokens/${this.user.uid}`, data);
  }
}


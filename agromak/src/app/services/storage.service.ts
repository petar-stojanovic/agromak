import {Injectable} from '@angular/core';
import {GetResult, Preferences} from "@capacitor/preferences";
import {from, map, Observable, take} from "rxjs";

export const APP_TOKEN = 'app_token';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() {
  }

  async setStorage(key: string, value: any) {
   await Preferences.set({key: key, value: value});
  }

  getStorage(key: string): Promise<GetResult> {
    return Preferences.get({key: key});
  }

  removeStorage(key: string) {
    Preferences.remove({key: key});
  }

  clearStorage() {
    Preferences.clear();
  }

  getToken() {
    return this.getStorage(APP_TOKEN);
  }
}

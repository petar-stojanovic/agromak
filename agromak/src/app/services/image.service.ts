import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {getDownloadURL, ref, Storage, uploadString} from "@angular/fire/storage";
import {AuthService} from "./auth.service";
import {doc, docData, Firestore, setDoc} from "@angular/fire/firestore";
import {Auth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../interfaces/user";
import {Photo} from "@capacitor/camera";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private auth: Auth,
              private firestore: Firestore,
              private angularFirestore: AngularFirestore,
              private afAuth: AngularFireAuth,
              private authService: AuthService,
              private storage: Storage) {
  }

  async uploadProfileImage(cameraFile: Photo) {
    const user = this.auth.currentUser as User;
    const path = `uploads/${user.uid}/profile.png`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String!, 'base64')

      const imageUrl = await getDownloadURL(storageRef);

      const userDocRef = doc(this.firestore, `users/${user.uid}`)
      await setDoc(userDocRef, {
          photoURL: imageUrl
        }, {
          merge: true
        }
      );
      return true;

    } catch (e) {
      console.log("ERROR - ", e)
      return null;
    }
  }

}

import {Filesystem, Directory, Encoding} from '@capacitor/filesystem';

import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {getDownloadURL, ref, Storage, uploadString} from "@angular/fire/storage";
import {AuthService} from "./auth.service";
import {doc, docData, Firestore, getDoc, setDoc} from "@angular/fire/firestore";
import {Auth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../interfaces/user";
import {GalleryPhoto, Photo} from "@capacitor/camera";

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

  async uploadAdImages(documentId: string, galleryPhotos: GalleryPhoto[]) {
    const path = `ads/${documentId}`;
    const storageRef = ref(this.storage, path);

    try {
      // Get the current document data
      const userDocRef = doc(this.firestore, path);
      const docSnapshot = await getDoc(userDocRef);
      const currentImages = docSnapshot.exists() ? docSnapshot.data()['images'] || [] : [];

      // Upload new images and update the document
      for (const photo of galleryPhotos) {
        try {
          const base64Data = await this.readAsBase64(photo.path!);

          if (typeof base64Data === "string") {
            await uploadString(storageRef, base64Data, 'base64', {contentType: 'image/png'});
          }


          const imageUrl = await getDownloadURL(storageRef);
          currentImages.push(imageUrl);
        } catch (e) {
          console.log("ERROR - ", e);
          return null;
        }
      }

      // Update the document with new set of images
      await setDoc(userDocRef, {images: currentImages}, {merge: true});

      console.log(currentImages)
      return currentImages;
    } catch (e) {
      console.error("ERROR - ", e);
      return null;
    }
  }


  async readAsBase64(path: string) {
    const file = await Filesystem.readFile({
      path: path
    });

    return file.data
  }

}

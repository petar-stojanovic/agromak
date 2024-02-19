import {Filesystem} from '@capacitor/filesystem';

import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {getDownloadURL, ref, Storage, uploadString} from "@angular/fire/storage";
import {AuthService} from "./auth.service";
import {doc, Firestore, setDoc} from "@angular/fire/firestore";
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
    const path = `profile/${user.uid}/profile.png`;
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
    const basePath = `ads/${documentId}/`;
    const userDocRef = doc(this.firestore, basePath);

    try {
      const imagesToUpload = [];

      for (const photo of galleryPhotos) {
        const imageName = this.getImageName(photo.path!);
        const storageReference = ref(this.storage, basePath + imageName); // Create a unique path for each image
        const base64Data = await this.readAsBase64(photo.path!);

        if (typeof base64Data === "string") {
          await uploadString(storageReference, base64Data, 'base64');
          const imageUrl = await getDownloadURL(storageReference);
          imagesToUpload.push(imageUrl);
        }

      }

      await setDoc(userDocRef, {images: imagesToUpload}, {merge: true});
      console.log(imagesToUpload)

      return imagesToUpload;
    } catch (e) {
      console.error("ERROR - ", e);
      return null;
    }
  }

  private getImageName(fullPath: string) {
    const parts = fullPath.split('/');
    return parts[parts.length - 1]; // Get the last part of the path which is the image name
  }

  private async readAsBase64(path: string) {
    const file = await Filesystem.readFile({
      path: path
    });

    return file.data
  }

}

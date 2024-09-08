import {Filesystem} from '@capacitor/filesystem';

import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {deleteObject, getDownloadURL, ref, Storage, uploadString} from "@angular/fire/storage";
import {AuthService} from "./auth.service";
import {doc, Firestore, setDoc, updateDoc} from "@angular/fire/firestore";
import {Auth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../shared/models/user";
import {GalleryPhoto} from "@capacitor/camera";
import {NgxImageCompressService} from "ngx-image-compress";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  user!: User;

  constructor(private auth: Auth,
              private firestore: Firestore,
              private angularFirestore: AngularFirestore,
              private imageCompress: NgxImageCompressService,
              private afAuth: AngularFireAuth,
              private authService: AuthService,
              private storage: Storage) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    })
  }

  async uploadProfileImage(base64Image: string) {
    const path = `profile/${this.user.uid}/profile.png`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, base64Image, 'data_url', {contentType: 'image/jpeg'});

      const imageUrl = await getDownloadURL(storageRef);

      const userDocRef = doc(this.firestore, `users/${this.user.uid}`)
      await updateDoc(userDocRef, {
          photoURL: imageUrl
        }
      );
      return true;
    } catch (e) {
      console.log("ERROR - ", e)
      return null;
    }
  }

  async uploadAdImages(adId: string, galleryPhotos: GalleryPhoto[] | string[]) {
    const basePath = `ads/${adId}/`;
    const userDocRef = doc(this.firestore, basePath);

    try {
      const imagesToUpload = [];

      for (const photo of galleryPhotos) {
        if (typeof photo === "string") {
          imagesToUpload.push(photo);
          continue;
        }
        const imageName = this.getImageName(photo.path!);
        const storageReference = ref(this.storage, basePath + imageName);
        const base64Data = await this.readAsBase64(photo.path!);

        if (typeof base64Data === "string") {
          await uploadString(storageReference, base64Data, 'base64', {contentType: 'image/jpeg'});
          const imageUrl = await getDownloadURL(storageReference);
          imagesToUpload.push(imageUrl);
        }
      }

      await setDoc(userDocRef, {images: imagesToUpload}, {merge: true});

      return imagesToUpload;
    } catch (e) {
      console.error("ERROR - ", e);
      return null;
    }
  }

  async uploadAiChatImage(chatId: string, base64Image: string, messageId: string) {
    const path = `aiChats/${chatId}/${messageId}.jpeg`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, base64Image, 'data_url', {contentType: 'image/jpeg'});

      return await getDownloadURL(storageRef);
    } catch (e) {
      console.log("ERROR - ", e)
      return null;
    }
  }

  async deleteImages(ad: any, imagesToDelete: string[]) {
    for (const imageUrl of imagesToDelete) {
      try {
        const storageRef = ref(this.storage, imageUrl);
        await deleteObject(storageRef);
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }
  }

  private getImageName(fullPath: string) {
    const parts = fullPath.split('/');
    return parts[parts.length - 1];
  }

  async readAsBase64(path: string) {
    const file = await Filesystem.readFile({
      path: path
    });

    return file.data
  }


  async compressImage(base64Image: string, isHighRes = false): Promise<string> {
    return isHighRes
      ? await this.imageCompress
        .compressFile(`data:image/jpeg;base64,${base64Image!}`, 0, 75, 75, 1024, 1024)
      : await this.imageCompress
        .compressFile(`data:image/jpeg;base64,${base64Image!}`, 0, 75, 75, 512, 512)
  }
}

import {Filesystem} from '@capacitor/filesystem';

import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {deleteObject, getDownloadURL, ref, Storage, uploadString} from "@angular/fire/storage";
import {AuthService} from "./auth.service";
import {arrayRemove, doc, Firestore, setDoc, updateDoc} from "@angular/fire/firestore";
import {Auth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../shared/models/user";
import {GalleryPhoto} from "@capacitor/camera";
import {NgxImageCompressService} from "ngx-image-compress";
import {Ad} from "../shared/models/ad";
import {ApiService} from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  user!: User;

  constructor(private firestore: Firestore,
              private imageCompress: NgxImageCompressService,
              private authService: AuthService,
              private apiService: ApiService,
              private storage: Storage) {
    this.authService.user$.subscribe(user => {
      this.user = user;
    })
  }

  async uploadProfileImage(base64Image: string) {
    const path = `profile/${this.user.uid}/profile.png`;
    const storageRef = ref(this.storage, path);
    await uploadString(storageRef, base64Image, 'data_url', {contentType: 'image/jpeg'});

    const imageUrl = await getDownloadURL(storageRef);

    const userDocRef = doc(this.firestore, `users/${this.user.uid}`)
    await updateDoc(userDocRef, {photoURL: imageUrl});

  }

  async uploadAdImages(adId: string, images: string[]) {
    const basePath = `ads/${adId}`;
    const adDocRef = this.apiService.docRef(basePath);

    const adDocSnapshot = await this.apiService.getDocById(basePath);
    const adData = adDocSnapshot.data() as Ad;

    const existingImages = adData?.images || [];

    const imagesToUpload = [];
    for (const img of images) {
      const imgName = `/${Date.now()}.jpeg`;
      const storageRef = ref(this.storage, basePath + imgName);
      const compressedImage = await this.compressImage(img, true);

      await uploadString(storageRef, compressedImage, 'data_url', {contentType: 'image/jpeg'});

      const imageUrl = await getDownloadURL(storageRef);
      imagesToUpload.push(imageUrl);
    }
    const allImages = [...existingImages, ...imagesToUpload];

    await updateDoc(adDocRef, {images: allImages});

    return allImages;
  }

  async uploadAiChatImage(chatId: string, base64Image: string, messageId: string) {
    const path = `aiChats/${chatId}/${messageId}.jpeg`;
    const storageRef = ref(this.storage, path);

    await uploadString(storageRef, base64Image, 'data_url', {contentType: 'image/jpeg'});

    return await getDownloadURL(storageRef);
  }

  async deleteImages(ad: any, imagesToDelete: string[]) {
    for (const imageUrl of imagesToDelete) {
      const storageRef = ref(this.storage, imageUrl);
      await deleteObject(storageRef);
    }
  }

  async readAsBase64(path: string): Promise<string> {
    const file = await Filesystem.readFile({
      path: path
    });
    return file.data as string;
  }


  async compressImage(base64Image: string, isHighRes = false): Promise<string> {
    return isHighRes
      ? await this.imageCompress
        .compressFile(`data:image/jpeg;base64,${base64Image!}`, 0, 75, 75, 1024, 1024)
      : await this.imageCompress
        .compressFile(`data:image/jpeg;base64,${base64Image!}`, 0, 75, 75, 512, 512)
  }

  async deleteAdImage(adId: string, imageURL: string) {
    console.log(imageURL)
    const storageRef = ref(this.storage, imageURL);
    await deleteObject(storageRef);
    const adDocRef = doc(this.firestore, `ads/${adId}`);

    await updateDoc(adDocRef, {
      images: arrayRemove(imageURL)
    });
  }
}

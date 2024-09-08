import {Filesystem} from '@capacitor/filesystem';
import {Injectable} from '@angular/core';
import {deleteObject, getDownloadURL, ref, Storage, uploadString} from "@angular/fire/storage";
import {AuthService} from "./auth.service";
import {arrayRemove, doc, Firestore, updateDoc} from "@angular/fire/firestore";
import {User} from "../shared/models/user";
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

  /**
   * Uploads a profile image to Firebase Storage and updates Firestore user document with the image URL.
   * @param base64Image - The base64 representation of the image.
   */
  async uploadProfileImage(base64Image: string) {
    const path = `profile/${this.user.uid}/profile.png`;
    const storageRef = ref(this.storage, path);
    await uploadString(storageRef, base64Image, 'data_url', {contentType: 'image/jpeg'});

    const imageUrl = await getDownloadURL(storageRef);

    const userDocRef = doc(this.firestore, `users/${this.user.uid}`)
    await updateDoc(userDocRef, {photoURL: imageUrl});
  }

  /**
   * Uploads ad images to Firebase Storage, updates Firestore ad document with the image URLs.
   * @param adId - The ID of the ad.
   * @param images - Array of base64 image strings.
   */
  async uploadAdImages(adId: string, images: string[]) {
    const basePath = `ads/${adId}`;

    const adDocSnapshot = await this.apiService.getDocById(basePath);
    const adData = adDocSnapshot.data() as Ad;

    const allImages = adData?.images || [];

    for (const img of images) {
      const storageRef = ref(this.storage, `${basePath}/${Date.now()}.jpeg`);
      const compressedImage = await this.compressImage(img, true);

      await uploadString(storageRef, compressedImage, 'data_url', {contentType: 'image/jpeg'});

      const imageUrl = await getDownloadURL(storageRef);
      allImages.push(imageUrl);
    }

    await this.apiService.updateDocument(basePath, {images: allImages});
  }

  /**
   * Uploads a single AI chat image to Firebase Storage and returns the image URL.
   * @param chatId - The ID of the chat.
   * @param base64Image - The base64 representation of the image.
   * @param messageId - The ID of the message.
   * @returns The URL of the uploaded image.
   */
  async uploadAiChatImage(chatId: string, base64Image: string, messageId: string) {
    const path = `aiChats/${chatId}/${messageId}.jpeg`;
    const storageRef = ref(this.storage, path);

    await uploadString(storageRef, base64Image, 'data_url', {contentType: 'image/jpeg'});
    return await getDownloadURL(storageRef);
  }

  /**
   * Deletes images from Firebase Storage.
   * @param imagesToDelete - Array of image URLs to delete.
   */
  async deleteImages(imagesToDelete: string[]) {
    for (const imageUrl of imagesToDelete) {
      const storageRef = ref(this.storage, imageUrl);
      await deleteObject(storageRef);
    }
  }

  /**
   * Reads a file as a base64 string from a given path.
   * @param path - The path to the file.
   * @returns Base64 encoded string.
   */
  async readAsBase64(path: string): Promise<string> {
    const file = await Filesystem.readFile({path});
    return file.data as string;
  }

  /**
   * Compresses a base64 image using.
   * @param base64Image - The base64 string of the image.
   * @param isHighRes - Boolean indicating if high resolution is needed.
   * @returns Compressed base64 image string.
   */
  async compressImage(base64Image: string, isHighRes = false): Promise<string> {
    return isHighRes
      ? await this.imageCompress
        .compressFile(`data:image/jpeg;base64,${base64Image!}`, 0, 75, 75, 1024, 1024)
      : await this.imageCompress
        .compressFile(`data:image/jpeg;base64,${base64Image!}`, 0, 75, 75, 512, 512)
  }

  /**
   * Deletes an ad image from Firebase Storage and updates the ad document in Firestore.
   * @param adId - The ID of the ad.
   * @param imageURL - The URL of the image to delete.
   */
  async deleteAdImage(adId: string, imageURL: string) {
    await this.deleteImages([imageURL]);
    const adDocRef = this.apiService.docRef(`ads/${adId}`);

    await updateDoc(adDocRef, {
      images: arrayRemove(imageURL)
    });
  }
}

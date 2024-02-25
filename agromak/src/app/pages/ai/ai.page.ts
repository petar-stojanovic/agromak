import {Component} from '@angular/core';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter, IonGrid,
  IonHeader,
  IonIcon, IonRow, IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {environment} from "../../../environments/environment";
import {GoogleAiService} from "../../services/google-ai.service";
import {Camera, CameraResultType, CameraSource, GalleryPhoto} from "@capacitor/camera";
import {NgForOf, NgIf} from "@angular/common";
import {ImageService} from "../../services/image.service";

@Component({
  selector: 'app-ai',
  templateUrl: 'ai.page.html',
  styleUrls: ['ai.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButton, IonIcon, IonCol, IonGrid, IonRow, IonText, NgForOf, NgIf]
})
export class AiPage {
  images: GalleryPhoto[] = [];
  selectedImages: any[] = [];

  constructor(private _googleAIService: GoogleAiService,
              private _imageService: ImageService) {
  }

  async uploadImages() {
    const images = await Camera.pickImages({
      quality: 90,
    })
    this.images = [];

    if (images) {
      images.photos.forEach((photo) => {
        this.images.push(photo);
      });

      for (const photo of images.photos) {
        const base64Data = await this._imageService.readAsBase64(photo.path!);
        this.selectedImages.push({
          inlineData: {data: base64Data, mimeType: 'image/jpeg'}
        });
      }

       console.log(this.selectedImages);
    }
  }

  async generateContent() {
    const prompt = "What's different between these pictures?";
    const text = await this._googleAIService.generateContent(prompt, this.selectedImages);
    console.log(text);
  }


}

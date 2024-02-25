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
import {GoogleAiService} from "../../services/google-ai.service";
import {Camera, CameraResultType, CameraSource, GalleryPhoto} from "@capacitor/camera";
import {NgForOf, NgIf} from "@angular/common";
import {ImageService} from "../../services/image.service";
import {OpenAiService} from "../../services/open-ai.service";

@Component({
  selector: 'app-ai',
  templateUrl: 'ai.page.html',
  styleUrls: ['ai.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButton, IonIcon, IonCol, IonGrid, IonRow, IonText, NgForOf, NgIf]
})
export class AiPage {
  images: GalleryPhoto[] = [];
  googleSelectedImages: any[] = [];
  openAISelectedImages: string[] = [];

  constructor(private _googleAIService: GoogleAiService,
              private _openAIService: OpenAiService,
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
        this.googleSelectedImages.push({
          inlineData: {data: base64Data, mimeType: 'image/jpeg'}
        });
        if (typeof base64Data === 'string') {
          this.openAISelectedImages.push(base64Data);
        }
      }

      console.log(this.googleSelectedImages);
    }
  }

  async generateContentWithGoogle() {
    const prompt = "What's different between these pictures?";
    const text = await this._googleAIService.generateContent(prompt, this.googleSelectedImages);
    console.log(text);
  }


  generateContentWithOpenAI() {
    this._openAIService.generateContent('What\'s different between these pictures?', this.openAISelectedImages)
      .subscribe((response) => {
        console.log(response);
      });
  }
}

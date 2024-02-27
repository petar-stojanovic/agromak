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
import {Camera, CameraResultType, CameraSource, GalleryPhoto, Photo} from "@capacitor/camera";
import {NgForOf, NgIf} from "@angular/common";
import {ImageService} from "../../services/image.service";
import {OpenAiService} from "../../services/open-ai.service";
import {Ng2ImgMaxService} from 'ng2-img-max';

@Component({
  selector: 'app-ai',
  templateUrl: 'ai.page.html',
  styleUrls: ['ai.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButton, IonIcon, IonCol, IonGrid, IonRow, IonText, NgForOf, NgIf]
})
export class AiPage {
  image: Photo | null = null;
  googleSelectedImages: any[] = [];
  openAISelectedImages: string[] = [];

  constructor(private _googleAIService: GoogleAiService,
              private _openAIService: OpenAiService,
              private _imageService: ImageService,
              private ng2ImgMaxService: Ng2ImgMaxService) {
  }

  async uploadImages() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });

    if (image) {
      this.image = image;

      // const base64Data = await this._imageService.readAsBase64(photo.path!);
      // this.googleSelectedImages.push({
      //   inlineData: {data: base64Data, mimeType: 'image/jpeg'}
      // });
      // if (typeof base64Data === 'string') {
      //   // this.openAISelectedImages.push(base64Data);
      //
      //   this.ng2ImgMaxService.resizeImage("https://firebasestorage.googleapis.com/v0/b/agromak-1e9c8.appspot.com/o/ads%2FHx14vMGu3mcdfaiSGfvA%2FIMG_20240220_180858.jpg?alt=media&token=e19ade67-8b56-42b6-a698-04b1a4ce35c6", 0.5).subscribe(result => {
      //     this.openAISelectedImages.push(result);
      //   });
      // }

      console.log(this.image);
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

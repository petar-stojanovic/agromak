import {Component} from '@angular/core';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {GoogleAiService} from "../../services/google-ai.service";
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import {NgForOf, NgIf} from "@angular/common";
import {ImageService} from "../../services/image.service";
import {OpenAiService} from "../../services/open-ai.service";
import {Ng2ImgMaxService} from 'ng2-img-max';

@Component({
  selector: 'app-ai',
  templateUrl: 'ai.page.html',
  styleUrls: ['ai.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButton, IonIcon, IonText, NgForOf, NgIf, IonGrid, IonRow, IonCol]
})
export class AiPage {
  image: Photo | null = null;
  compressedImage: any;

  constructor(private _googleAIService: GoogleAiService,
              private _openAIService: OpenAiService,
              private _imageService: ImageService,
              private ng2ImgMaxService: Ng2ImgMaxService) {
  }

  async uploadImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos
    });

    if (image) {
      this.image = image;


      const imageBlob = this.dataURItoBlob(image.base64String!);
      const imageName = 'name.png';
      const imageFile = new File([imageBlob], imageName, {type: 'image/jpeg'});

      this.ng2ImgMaxService.resizeImage(imageFile, 500,500).subscribe((file) => {
        console.log(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          console.log(base64String);
          this.compressedImage = base64String;
        };
        if (file) {
          reader.readAsDataURL(file);
        }
      });

      console.log(imageFile);
    }
  }

  dataURItoBlob(dataURI: string) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([int8Array], {type: 'image/jpeg'});
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

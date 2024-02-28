import {Component} from '@angular/core';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
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
import {AiImageResponse} from "../../shared/interfaces/ai-image-response";
import {addIcons} from "ionicons";
import {addCircleOutline, closeOutline, sendOutline} from "ionicons/icons";

@Component({
  selector: 'app-ai',
  templateUrl: 'ai.page.html',
  styleUrls: ['ai.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButton, IonIcon, IonText, NgForOf, NgIf, IonGrid, IonRow, IonCol, IonInput, IonItem, IonLabel, IonList]
})
export class AiPage {
  image: Photo | null = null;
  compressedImage: string | null = null;

  response: any;

  constructor(private _googleAIService: GoogleAiService,
              private _openAIService: OpenAiService,
              private _imageService: ImageService,
              private ng2ImgMaxService: Ng2ImgMaxService) {
    addIcons({addCircleOutline, sendOutline, closeOutline})
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

      const file = this._imageService.createFileFromBase64(image.base64String!);

      this.ng2ImgMaxService.resizeImage(file, 500, 500).subscribe((file) => {
        console.log(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          this.compressedImage = reader.result as string;
        };
        if (file) {
          reader.readAsDataURL(file);
        }
      });

      console.log(file);
    }
  }


  generateContentWithOpenAI() {
    this._openAIService.generateContent("What's in this image?", this.compressedImage!)
      .subscribe((response: AiImageResponse) => {
        this.response = response.choices[0].message.content;
        console.log(response);
      });
  }
}

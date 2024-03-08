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
  IonText, IonThumbnail,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {GoogleAiService} from "../../services/google-ai.service";
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import {NgForOf, NgIf} from "@angular/common";
import {ImageService} from "../../services/image.service";
import {OpenAiService} from "../../services/open-ai.service";
import {Ng2ImgMaxService} from 'ng2-img-max';
import {addIcons} from "ionicons";
import {addCircleOutline, closeOutline, sendOutline} from "ionicons/icons";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Message} from "../../shared/interfaces/message";

@Component({
  selector: 'app-ai',
  templateUrl: 'ai.page.html',
  styleUrls: ['ai.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonFooter, IonButton, IonIcon, IonText, NgForOf, NgIf, IonGrid, IonRow, IonCol, IonInput, IonItem, IonLabel, IonList, FormsModule, ReactiveFormsModule, IonThumbnail]
})
export class AiPage {
  image: Photo | null = null;
  compressedImage: string | null = null;

  form: FormGroup;

  response = "";

  messages: Message[] = [];

  constructor(private _googleAIService: GoogleAiService,
              private _openAIService: OpenAiService,
              private _imageService: ImageService,
              private ng2ImgMaxService: Ng2ImgMaxService) {
    addIcons({addCircleOutline, sendOutline, closeOutline})
    this.form = new FormGroup({
      question: new FormControl("What's in the image?", [Validators.required])
    });

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


  async generateContentWithOpenAI() {

    const {question} = this.form.value;
    this.form.reset();
    console.log(question);
    this.messages.push({from: "YOU", message: question, image: this.compressedImage!});

    const stream = await this._openAIService.generateContentWithOpenAI(question, this.compressedImage!);

    this.messages.push({from: "AI", message: ""});


    let latestMessageIndex = this.messages.length - 1;

    for await (const chunk of stream) {
      const aiResponse = chunk.choices[0].delta.content || '';
      this.messages[latestMessageIndex].message += aiResponse;

      console.log(aiResponse);
      this.response += aiResponse;
    }


  }

}

import {Component, ViewChild} from '@angular/core';
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
  IonThumbnail,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import {NgForOf, NgIf} from "@angular/common";
import {ImageService} from "../../services/image.service";
import {OpenAiService} from "../../services/open-ai.service";
import {Ng2ImgMaxService} from 'ng2-img-max';
import {addIcons} from "ionicons";
import {addCircleOutline, closeOutline, sendOutline} from "ionicons/icons";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Message} from "../../shared/models/message";
import {AuthService} from "../../services/auth.service";
import {User} from "../../shared/models/user";

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

  messages: Message[] = [];

  user: User | null = null;

  @ViewChild('content') content: any;


  constructor(private _openAIService: OpenAiService,
              private _imageService: ImageService,
              private ng2ImgMaxService: Ng2ImgMaxService,
              private _authService: AuthService) {
    addIcons({addCircleOutline, sendOutline, closeOutline})
    this._authService.user$
      .subscribe({
          next: (data) => {
            this.user = data;
          }
        }
      );
    this.form = new FormGroup({
      question: new FormControl("", [Validators.required])
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
    }

  }


  async generateContentWithOpenAI() {

    const {question} = this.form.value;
    this.form.reset();
    this.messages.push({
      from: "YOU",
      message: question,
      image: this.image ? `data:image/jpeg;base64,${this.image?.base64String}` : undefined
    });

    this.image = null;
    this.compressedImage = null;

    const stream = await this._openAIService.generateContentWithOpenAI(this.messages);

    this.messages.push({from: "AI", message: ""});

    const latestMessageIndex = this.messages.length - 1;

    for await (const chunk of stream) {
      const aiResponse = chunk.choices[0].delta.content || '';
      this.messages[latestMessageIndex].message += aiResponse;
      console.log(this.messages)
      await this.content.scrollToBottom(100);
    }

  }

}

import {Component, ViewChild} from '@angular/core';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import {ImageService} from "../../services/image.service";
import {OpenAiService} from "../../services/open-ai.service";
import {Ng2ImgMaxService} from 'ng2-img-max';
import {addIcons} from "ionicons";
import {addCircleOutline, closeOutline, sendOutline} from "ionicons/icons";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Message} from "../../shared/models/message";
import {AuthService} from "../../services/auth.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-ai',
  templateUrl: 'ai.page.html',
  styleUrls: ['ai.page.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonThumbnail, IonText, IonLabel, IonFooter, IonIcon, IonInput, IonButton, AsyncPipe]
})
export class AiPage {
  image: Photo | null = null;
  compressedImage: string | null = null;

  form: FormGroup;

  messages: Message[] = [];

  user$ = this.authService.user$;

  @ViewChild('content') content: any;


  constructor(private openAiService: OpenAiService,
              private imageService: ImageService,
              private ng2ImgMaxService: Ng2ImgMaxService,
              private authService: AuthService) {
    addIcons({addCircleOutline, sendOutline, closeOutline})

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

    const stream = await this.openAiService.generateContentWithOpenAI(this.messages);

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

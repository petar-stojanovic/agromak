import {Component, OnDestroy, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
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
import {ImageService} from "../../../services/image.service";
import {OpenAiService} from "../../../services/open-ai.service";
import {Ng2ImgMaxService} from 'ng2-img-max';
import {addIcons} from "ionicons";
import {addCircleOutline, closeOutline, sendOutline} from "ionicons/icons";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AiMessage} from "../../../shared/models/ai-message";
import {AuthService} from "../../../services/auth.service";
import {AsyncPipe} from "@angular/common";
import {MarkdownComponent} from "ngx-markdown";
import {AiChatService} from "../../../services/ai-chat.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-ai',
  templateUrl: 'ai.page.html',
  styleUrls: ['ai.page.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonThumbnail, IonText, IonLabel, IonFooter, IonIcon, IonInput, IonButton, AsyncPipe, IonBackButton, IonButtons, MarkdownComponent]
})
export class AiPage implements OnInit, OnDestroy, AfterViewInit {
  image: Photo | null = null;
  compressedImage: string | null = null;

  form: FormGroup;

  messages: AiMessage[] = [];

  user$ = this.authService.user$;

  @ViewChild('content') content!: IonContent;

  chatId = '';

  constructor(private openAiService: OpenAiService,
              private imageService: ImageService,
              private ng2ImgMaxService: Ng2ImgMaxService,
              private authService: AuthService,
              private chatService: AiChatService,
              private route: ActivatedRoute) {
    addIcons({addCircleOutline, sendOutline, closeOutline})

    this.form = new FormGroup({
      question: new FormControl("", [Validators.required])
    });

    this.chatId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.chatService.getChat(this.chatId).subscribe(chat => {
      console.log(chat)
      if (chat && chat.messages) {
        this.messages = chat.messages;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(async () => {
      await this.scrollToBottom()
    }, 500)
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


    const userMessage: AiMessage = {
      from: "YOU",
      message: question,
      image: this.image ? `data:image/jpeg;base64,${this.image?.base64String}` : null
    };

    this.messages.push(userMessage);

    this.image = null;
    this.compressedImage = null;


    await this.chatService.updateChat(this.chatId, userMessage);

    const stream = await this.openAiService.generateContentWithOpenAI(this.messages);

    this.messages.push({from: "AI", message: "", image: null});

   await this.scrollToBottom();

    const latestMessageIndex = this.messages.length - 1;

    for await (const chunk of stream) {
      const aiResponse = chunk.choices[0].delta.content || '';
      this.messages[latestMessageIndex].message += aiResponse;
      // console.log(this.messages)
    }

    await this.chatService.updateChat(this.chatId, this.messages[latestMessageIndex]);
  }

  private async scrollToBottom() {
    await this.content.scrollToBottom(500);
  }

  ngOnDestroy() {
    this.chatService.deleteAiChatIfEmpty(this.chatId);
  }
}

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonSpinner,
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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AiMessage} from "../../../shared/models/ai-message";
import {AuthService} from "../../../services/auth.service";
import {AsyncPipe, DatePipe} from "@angular/common";
import {MarkdownComponent} from "ngx-markdown";
import {AiChatService} from "../../../services/ai-chat.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../../shared/models/user";
import {Subscription} from "rxjs";
import {NgxImageCompressService} from "ngx-image-compress";

@Component({
  selector: 'app-ai-chat',
  templateUrl: './ai-chat.page.html',
  styleUrls: ['./ai-chat.page.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonThumbnail, IonText, IonLabel, IonFooter, IonIcon, IonInput, IonButton, AsyncPipe, IonBackButton, IonButtons, MarkdownComponent, IonImg, DatePipe, IonSpinner]
})
export class AiChatPage implements OnInit, OnDestroy {
  image: Photo | null = null;
  compressedImage: string | null = null;

  messages: AiMessage[] = [];

  user?: User;

  @ViewChild('content') content!: IonContent;
  @ViewChild('chatInput') chatInput!: IonInput;

  chatId = '';
  subscription?: Subscription;
  messageIsLoading = false;
  aiMessageResponse = '';

  constructor(private openAiService: OpenAiService,
              private imageService: ImageService,
              private ng2ImgMaxService: Ng2ImgMaxService,
              private imageCompress: NgxImageCompressService,
              private authService: AuthService,
              private aiChatService: AiChatService,
              private route: ActivatedRoute) {
    addIcons({addCircleOutline, sendOutline, closeOutline})
    this.authService.user$.subscribe(user => this.user = user);

    this.chatId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit() {
    this.subscription = this.aiChatService.getChat(this.chatId).subscribe(messages => {
      this.messages = messages;
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    });
  }


  async uploadImage() {
    try {
      const image: Photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      if (image) {
        this.image = image;

        this.compressedImage = await this.imageService.compressImage(image);
      }
    } catch (error) {
      console.info('Error uploading image', error);
    }
  }

  async sendMessage() {
    const value = this.chatInput.value?.toString().trim();
    console.log(value)
    if (!value) {
      return;
    }
    await this.generateContentWithOpenAI(value);
    this.chatInput.value = null;
  }

  async generateContentWithOpenAI(question: string) {
    this.aiMessageResponse = '';
    this.messageIsLoading = true;

    let userMessage: AiMessage;
    if (this.compressedImage) {
      userMessage = {
        from: this.user?.uid || 'YOU',
        message: question,
        image: this.compressedImage
      }
    } else {
      userMessage = {
        from: this.user?.uid || 'YOU',
        message: question,
      }
    }
    this.image = null;
    this.compressedImage = null;

    await this.aiChatService.sendMessage(this.chatId, userMessage);

    const stream = await this.openAiService.generateContentWithOpenAI(this.messages);

    const aiMessage: AiMessage = {
      from: "AI",
      message: ""
    };

    for await (const chunk of stream) {
      this.aiMessageResponse += chunk.choices[0].delta.content || '';
      aiMessage.message = this.aiMessageResponse;
    }

    await this.aiChatService.sendMessage(this.chatId, aiMessage);
    this.scrollToBottom();
    this.aiMessageResponse = '';
    this.messageIsLoading = false;
  }

  private scrollToBottom() {
    if (this.messages.length > 0) {
      this.content.scrollToBottom(100);
    }
  }

  ngOnDestroy() {
    this.aiChatService.deleteAiChatIfEmpty(this.chatId);
    this.subscription?.unsubscribe();
  }
}

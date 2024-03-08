import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import OpenAI from "openai";
import {CompletionCreateParamsStreaming} from "openai/src/resources/chat/completions";
import {Message} from "../shared/interfaces/message";

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  openai: OpenAI;

  constructor(private http: HttpClient) {
    this.openai = new OpenAI({
      apiKey: "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",
      dangerouslyAllowBrowser: true
    });
  }

  async generateContentWithOpenAI(messages: Message[]) {

    const stream = await this.openai.chat.completions.create({
      "model": "gpt-4-vision-preview",
      "stream": true,
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant. Assume the role of a helpful assistant specialized in facilitating product sales." +
            "You are designed to provide assistance related to selling items and answering questions about products." +
            "Only respond to queries directly related to selling, product information, or relevant inquiries." +
            "Do not generate responses for requests involving tasks unrelated to the selling process, " +
            "such as requests for writing Python scripts or any other non-sales-related topics." +
            "Keep responses short, simple, and easy to understand"
        },
        ...messages.map(message => {
          const content: any[] = [
            {
              type: 'text',
              text: message.message
            }
          ];

          if (message.image) {
            content.push({
              type: 'image_url',
              image_url: {
                url: message.image
              }
            });
          }

          return {
            role: message.from === 'YOU' ? 'user' : 'assistant',
            content: content
          };
        }),
        // {
        //   "role": "user",
        //   "content": [
        //     {
        //       "type": "text",
        //       "text": `${prompt}`
        //     },
        //     {
        //       "type": "image_url",
        //       "image_url": {
        //         "url": `${base64image}`
        //       }
        //     },
        //   ]
        // }
      ],
      "max_tokens": 200
    } as CompletionCreateParamsStreaming);

    return stream;
  }

  generateContent(prompt: string, base64image?: string) {
    const payload = {
      "model": "gpt-4-vision-preview",
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant. Assume the role of a helpful assistant specialized in facilitating product sales.You are designed to provide assistance related to selling items and answering questions about products. Only respond to queries directly related to selling, product information, or relevant inquiries. Do not generate responses for requests involving tasks unrelated to the selling process, such as requests for writing Python scripts or any other non-sales-related topics. Keep responses short, simple, and easy to understand"
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": `${prompt}`
            },
            {
              "type": "image_url",
              "image_url": {
                "url": `${base64image}`
              }
            },
          ]
        }
      ],
      "max_tokens": 100
    }

    return this.http.post<any>('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`,
        // 'Authorization': `Bearer ${environment.OPEN_AI_API_KEY}`,
      }
    });
  }

}

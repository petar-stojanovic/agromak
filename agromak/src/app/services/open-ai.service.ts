import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import OpenAI from "openai";
import {ChatCompletionCreateParamsStreaming,} from "openai/src/resources/chat/completions";
import {Message} from "../shared/models/message";
import {OPEN_AI_SETTINGS} from "../../../api-keys";

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  openai: OpenAI;

  constructor(private http: HttpClient) {
    this.openai = new OpenAI(OPEN_AI_SETTINGS);
  }

  async generateContentWithOpenAI(messages: Message[]) {

    const stream = await this.openai.chat.completions.create({
      "model": "gpt-4o-mini",
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
        })
      ],
      "max_tokens": 200
    } as ChatCompletionCreateParamsStreaming);

    return stream;
  }

  async generateDescriptionForAd(prompt: string, category: string, subcategory: string, intention: string) {
    const stream = await this.openai.chat.completions.create({
      "model": "gpt-4o-mini",
      "stream": true,
      "messages": [
        {
          "role": "system",
          "content": "You are a helpful assistant." +
            "Given the user's intention to sell or buy a product, along with the product title, category, and subcategory, generate a " +
            "compelling and concise advertising description for an online advertisement." +
            " If the intention is to sell, start the description with \"I am selling,\" and if the intention is to buy, start with \"I want to buy.\"" +
            " The description should highlight key features, evoke interest, and be suitable for the specified product category. " +
            "Ensure the generated text is engaging and persuasive to potential customers. Keep the answer length to a maximum of 100 words."
        },
        {
          "role": "user",
          "content": "Title: " + prompt
        },
        {
          "role": "user",
          "content": "Category: " + category
        },
        {
          "role": "user",
          "content": "Subcategory: " + subcategory
        },
        {
          "role": "user",
          "content": "I want to: " + intention
        }
      ],
      "max_tokens": 250
    });

    return stream;
  }

  async test(messages: Message[]) {

    const stream = await this.openai.chat.completions.create({
      "model": "gpt-4o",
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
        })
      ],
      "max_tokens": 200
    } as ChatCompletionCreateParamsStreaming);

    return stream;
  }


}

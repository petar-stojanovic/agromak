import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {

  constructor(private http: HttpClient) {
  }


  generateContent(prompt: string, base64image: string) {
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
      "max_tokens": 200
    }

    console.log(payload)
    console.log(prompt)
    console.log(base64image)
    return this.http.post<any>('https://api.openai.com/v1/chat/completions', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${environment.OPEN_AI_API_KEY}`,
      }
    });
  }

}

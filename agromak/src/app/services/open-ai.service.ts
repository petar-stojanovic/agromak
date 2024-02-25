import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {

  constructor(private http: HttpClient) {
  }


  generateContent(prompt: string, imageParts: string[]) {
    // "model": "gpt-4-0125-preview",
    const payload = {
      "model": "gpt-4-vision-preview",
      "messages": [
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
                "url": `data:image/jpeg;base64,${imageParts[0]}`
              }
            },
            {
              "type": "image_url",
              "image_url": {
                "url": `data:image/jpeg;base64,${imageParts[1]}`
              }
            }
          ]
        }
      ],
      "max_tokens": 300
    }


    return this.http.post<any>('https://api.openai.com/v1/completions', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${environment.OPEN_AI_API_KEY}`,
      }
    });

  }
}

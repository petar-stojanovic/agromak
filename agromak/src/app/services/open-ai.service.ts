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
        'Authorization': `Bearer ${environment.OPEN_AI_API_KEY}
      }
    });
  }


}

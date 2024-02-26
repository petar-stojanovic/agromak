import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
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

  generateContentWithImaga(image: string) {
    const url = `https://api.imagga.com/v2/tags`;

    const credentials = btoa('acc_11d962b34693928:35810b474956ab3d43b59e798e58a99f');
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + credentials
    });

    const params = new HttpParams({
      fromObject: {
        'image_base64': image
      }
    });

    console.log(credentials);

    return this.http.get<any>(url,{
      headers: headers,
      params: params
    });
  }
}

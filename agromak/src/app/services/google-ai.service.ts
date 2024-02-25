import {Injectable} from '@angular/core';
import {GoogleGenerativeAI} from "@google/generative-ai";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GoogleAiService {

  genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(environment.API_KEY);
  }

  async generateContent(prompt: string, imageParts: any[]): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = result.response;
    console.log("RESULT", result);
    console.log("RESPONSE", response);
    console.log("TEXT", response.text);
    return response.text();
  }

}

import {Injectable} from '@angular/core';
import OpenAI from "openai";
import {ChatCompletionCreateParamsStreaming,} from "openai/src/resources/chat/completions";
import {AiMessage} from "../shared/models/ai-message";
import {OPEN_AI_SETTINGS} from "../../../api-keys";
import {ApiService} from "./api.service";
import {doc, Firestore, updateDoc} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  openai: OpenAI;

  constructor(private apiService: ApiService,
              private firestore: Firestore
  ) {
    this.openai = new OpenAI(OPEN_AI_SETTINGS);
  }

  async generateContentWithOpenAI(messages: AiMessage[]) {

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
            role: message.from === 'AI' ? 'assistant' : 'user',
            content: content
          };
        })
      ],
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


  async generateRelatedKeywords(searchQuery: string) {
    searchQuery = searchQuery.toLowerCase();
    const querySnapshot = await this.apiService.getDocById(`openaiKeywords/keywords`);
    const keywords = (querySnapshot.data() as any).keywords;
    if (keywords[searchQuery]) {
      console.log();
      return keywords[searchQuery];
    }

    const completion = await this.openai.chat.completions.create({
      "model": "gpt-4o-mini",
      frequency_penalty: 0.75,
      "messages": [
        {
          "role": "system",
          "content": "You are a smart and helpful assistant for an online marketplace/classified app similar to Ebay or Craigslist. When provided with a user's search query, generate a list of up to 10 highly relevant keywords or phrases that are contextually aligned with the user's intent. These keywords should be in lowercase and vary in length (single words or short phrases) to cover different aspects of the original search term, helping to refine and enhance search results and display related advertisements.\n" +
            "\n" +
            "For example, if the search query is \"iphone,\" the list might include keywords such as: [\"iphone\", \"apple\", \"smartphone\", \"mobile phone\", \"iphone cases\", \"iphone charger\", \"ios\", \"iphone 14\", \"iphone repair\", \"iphone accessories\"].\n" +
            "\n" +
            "Key points to follow:\n" +
            "\n" +
            "1. **Understand User Intent and Identify Multiple Contexts**: Focus on the user's original search term and identify the underlying intent, such as buying, selling, repairing, or finding information. Analyze the search term to identify different possible contexts or meanings (e.g., \"apple\" could refer to both a fruit and a tech company).\n" +
            "\n" +
            "2. **Generate Relevant Keywords for Each Context**: For each identified context, generate relevant keywords or phrases that are highly aligned with the user's potential intent, whether it's related to products, services, or information.\n" +
            "\n" +
            "3. **Handle Phrases and Ambiguity Effectively**: If the search query is a multi-word phrase, generate keywords and phrases relevant to the entire phrase, not just individual words. The keywords should reflect the overall meaning or context. When the query has multiple common interpretations, ensure the keywords list represents the diversity of meanings to provide comprehensive search results\n" +
            "\n" +
            "4. **Ensure Contextual Relevance**: Each keyword or phrase should be accurate and directly related to the possible meanings of the query to avoid irrelevant results.\n" +
            "\n" +
            "5. **Keep it Concise and Diverse**: Limit the list to the most relevant keywords (up to 10) across all potential contexts, ensuring a focused yet comprehensive set of suggestions.\n" +
            "\n" +
            "6. **Keep it short**: The keywords should be one or two words long, preferably only one word. If a phrase is necessary, it should be short and concise.\n" +
            "\n" +
            "7. **Always include the original search query in the list of keywords to maintain relevance and context.**\n" +
            "\n" +
            "Output the list of keywords in an array: [\"keyword1\", \"keyword2\", \"keyword3\", ...].\n"
        },
        {
          "role": "user",
          "content": "Search query: " + searchQuery
        },
      ],
    });
    const resultText = completion.choices[0].message.content;
    const resultArray = JSON.parse(resultText!);

    await this.apiService.updateDocument(`openaiKeywords/keywords`, {
      keywords: {
        ...keywords,
        [searchQuery]: resultArray
      }
    });
    console.log(resultArray);
    return resultArray;
  }
}

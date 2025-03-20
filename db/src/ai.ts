import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AIService {
  private readonly apiUrl = 'https://api.together.xyz/v1/completions';
  private readonly apiKey = process.env.TOGETHER_AI_KEY; 

  async getHabitSuggestion(habitType: string): Promise<string> {
    const prompt = `Suggest a simple habit related to ${habitType}.`;
    
    const response = await axios.post(
      this.apiUrl,
      {
        model: 'mistralai/Mistral-7B-Instruct-v0.1', // Free GPT-like model
        prompt,
        max_tokens: 100,
      },
      { headers: { Authorization: `Bearer ${this.apiKey}` } }
    );

    return response.data.choices?.[0]?.text || 'No suggestion available.';
  }
}

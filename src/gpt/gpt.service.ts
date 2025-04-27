import { forwardRef, Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { TwitterService } from '../twitter/twitter.service';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class GptService {
  private openai: OpenAI;

  constructor(
    private readonly twitterService: TwitterService,
    @Inject(forwardRef(() => TelegramService))
    private readonly telegramService: TelegramService,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }


async rewriteTextOnly(rawText: string): Promise<string> {
    const prompt = `
  Rewrite the following journal log as a short, casual tweet.
  
  Rules:
  - Keep the entire tweet in proper English.
  - Make it witty, light, and relatable — but not overdramatic or exaggerated.
  - Sound like a real young Nigerian professional venting or sharing a random thought.
  - Keep it short, clean, and emotionally real.
  - Do NOT add slang, memes, pidgin, or unnecessary dramatics.
  - Do NOT add hashtags.
  - Do NOT add emojis.
  - Do NOT invent or change the original meaning.
  - Keep it under 280 characters.
  
  Original:
  "${rawText}"
    `;
  
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });
  
    let tweetText = response.choices[0]?.message?.content?.trim() ?? '';
  
    if (tweetText.startsWith('"') && tweetText.endsWith('"')) {
      tweetText = tweetText.slice(1, -1).trim();
    }
  
    return tweetText;
  }
  
  async approveTweet(chatId: number, tweetText: string) {
    await this.twitterService.postTweet(tweetText);
    await this.telegramService.sendMessageToAdmin(`✅ Tweet posted: ${tweetText}`);
  }
  
  async redoTweet(chatId: number, previousText: string) {
    const newVersion = await this.rewriteTextOnly(previousText);
    this.telegramService.savePendingTweet(chatId, newVersion);
  
    await this.telegramService.sendMessageToAdmin(`🔁 *New Draft Tweet:*\n${newVersion}\n\nReply with *approve* / *redo* / *abort*.`, { parse_mode: 'Markdown' });
  }
  
}

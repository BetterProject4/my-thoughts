import { TwitterService } from '../twitter/twitter.service';
import { TelegramService } from 'src/telegram/telegram.service';
export declare class GptService {
    private readonly twitterService;
    private readonly telegramService;
    private openai;
    constructor(twitterService: TwitterService, telegramService: TelegramService);
    rewriteTextOnly(rawText: string): Promise<string>;
    approveTweet(chatId: number, tweetText: string): Promise<void>;
    redoTweet(chatId: number, previousText: string): Promise<void>;
}

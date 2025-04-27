import { OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { GptService } from 'src/gpt/gpt.service';
export declare class TelegramService implements OnModuleInit {
    private readonly gptService;
    private bot;
    private pendingTweets;
    constructor(gptService: GptService);
    onModuleInit(): void;
    sendMessageToAdmin(message: string, options?: TelegramBot.SendMessageOptions): Promise<void>;
    savePendingTweet(chatId: number, tweetText: string): void;
}

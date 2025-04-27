"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GptService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = require("openai");
const twitter_service_1 = require("../twitter/twitter.service");
const telegram_service_1 = require("../telegram/telegram.service");
let GptService = class GptService {
    constructor(twitterService, telegramService) {
        this.twitterService = twitterService;
        this.telegramService = telegramService;
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    async rewriteTextOnly(rawText) {
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
    async approveTweet(chatId, tweetText) {
        await this.twitterService.postTweet(tweetText);
        await this.telegramService.sendMessageToAdmin(`✅ Tweet posted: ${tweetText}`);
    }
    async redoTweet(chatId, previousText) {
        const newVersion = await this.rewriteTextOnly(previousText);
        this.telegramService.savePendingTweet(chatId, newVersion);
        await this.telegramService.sendMessageToAdmin(`🔁 *New Draft Tweet:*\n${newVersion}\n\nReply with *approve* / *redo* / *abort*.`, { parse_mode: 'Markdown' });
    }
};
exports.GptService = GptService;
exports.GptService = GptService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => telegram_service_1.TelegramService))),
    __metadata("design:paramtypes", [twitter_service_1.TwitterService,
        telegram_service_1.TelegramService])
], GptService);
//# sourceMappingURL=gpt.service.js.map
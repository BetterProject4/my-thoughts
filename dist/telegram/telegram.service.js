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
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const TelegramBot = require("node-telegram-bot-api");
const gpt_service_1 = require("../gpt/gpt.service");
let TelegramService = class TelegramService {
    constructor(gptService) {
        this.gptService = gptService;
        this.pendingTweets = {};
    }
    onModuleInit() {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        this.bot = new TelegramBot(token, { polling: true });
        this.bot.on('message', async (msg) => {
            const chatId = msg.chat.id;
            const text = msg.text?.trim();
            if (!text) {
                console.log(`⚠️ Skipped non-text message from ${chatId}`);
                return;
            }
            if (text.startsWith('/')) {
                console.log(`⚠️ Skipped command message: ${text}`);
                return;
            }
            console.log(`📩 Message received from ${chatId}: ${text}`);
            const rewritten = await this.gptService.rewriteTextOnly(text);
            this.pendingTweets[chatId] = rewritten;
            await this.bot.sendMessage(chatId, `📝 *Draft Tweet:*\n${rewritten}`, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: '✅ Approve', callback_data: 'approve' },
                            { text: '🔁 Redo', callback_data: 'redo' },
                            { text: '❌ Abort', callback_data: 'abort' },
                        ],
                    ],
                },
            });
        });
        this.bot.on('callback_query', async (query) => {
            const chatId = query.message.chat.id;
            const action = query.data;
            if (!this.pendingTweets[chatId]) {
                await this.bot.sendMessage(chatId, `⚠️ No pending tweet. Send a thought first.`);
                return;
            }
            const pendingTweet = this.pendingTweets[chatId];
            if (action === 'approve') {
                await this.gptService.approveTweet(chatId, pendingTweet);
                delete this.pendingTweets[chatId];
                await this.bot.answerCallbackQuery(query.id, { text: '✅ Tweet Approved!' });
            }
            else if (action === 'redo') {
                await this.gptService.redoTweet(chatId, pendingTweet);
                await this.bot.answerCallbackQuery(query.id, { text: '🔁 Rewriting...' });
            }
            else if (action === 'abort') {
                delete this.pendingTweets[chatId];
                await this.bot.sendMessage(chatId, `❌ Cancelled. No tweet posted.`);
                await this.bot.answerCallbackQuery(query.id, { text: '❌ Cancelled.' });
            }
        });
    }
    async sendMessageToAdmin(message, options) {
        const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
        if (!adminChatId)
            return;
        await this.bot.sendMessage(adminChatId, message, options);
    }
    savePendingTweet(chatId, tweetText) {
        this.pendingTweets[chatId] = tweetText;
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => gpt_service_1.GptService))),
    __metadata("design:paramtypes", [gpt_service_1.GptService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map
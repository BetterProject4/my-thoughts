import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { GptService } from 'src/gpt/gpt.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private bot: TelegramBot;
  private pendingTweets: { [chatId: number]: string } = {};

  constructor(
    @Inject(forwardRef(() => GptService))
    private readonly gptService: GptService,
  ) {}

  onModuleInit() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.bot = new (TelegramBot as any)(token, { polling: true });

    this.bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const text = msg.text?.trim();

      if (!text) {
        console.log(`⚠️ Skipped non-text message from ${chatId}`);
        return;
      }

      // 🚫 Skip system commands like /start
      if (text.startsWith('/')) {
        console.log(`⚠️ Skipped command message: ${text}`);
        return;
      }

      console.log(`📩 Message received from ${chatId}: ${text}`);

      // 🚀 No pending draft yet, treat this as a new thought
      const rewritten = await this.gptService.rewriteTextOnly(text);

      this.pendingTweets[chatId] = rewritten;

      await this.bot.sendMessage(
        chatId,
        `📝 *Draft Tweet:*\n${rewritten}`,
        {
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
        },
      );
    });

    // ✅ Handle button clicks
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
      } else if (action === 'redo') {
        await this.gptService.redoTweet(chatId, pendingTweet);
        await this.bot.answerCallbackQuery(query.id, { text: '🔁 Rewriting...' });
      } else if (action === 'abort') {
        delete this.pendingTweets[chatId];
        await this.bot.sendMessage(chatId, `❌ Cancelled. No tweet posted.`);
        await this.bot.answerCallbackQuery(query.id, { text: '❌ Cancelled.' });
      }
    });
  }

  async sendMessageToAdmin(message: string, options?: TelegramBot.SendMessageOptions) {
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
    if (!adminChatId) return;
    await this.bot.sendMessage(adminChatId, message, options);
  }

  savePendingTweet(chatId: number, tweetText: string) {
    this.pendingTweets[chatId] = tweetText;
  }
}

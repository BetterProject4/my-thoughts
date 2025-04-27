// src/twitter/twitter.service.ts
import { Injectable } from '@nestjs/common';
import { TwitterApi } from 'twitter-api-v2';

@Injectable()
export class TwitterService {
  private client: TwitterApi;

  constructor() {
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
  }

  /**
   * Posts a tweet with the given text
   * @param text The tweet content to post
   */
  async postTweet(text: string): Promise<void> {
    try {
      await this.client.v2.tweet(text);
      console.log(`✅ Tweet posted successfully: "${text}"`);
    } catch (error) {
      console.error('❌ Failed to post tweet:', error);
      throw error;
    }
  }
}

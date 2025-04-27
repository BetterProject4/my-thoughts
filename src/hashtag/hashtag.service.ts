// src/hashtag/hashtag.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashtagService {
  // Static hashtags (tech, dev, hustle life)
  private staticHashtags = [
    '#DevLife',
    '#TechTwitter',
    '#RemoteWork',
    '#BuildInPublic',
    '#LifeOfADev',
    '#FreelanceLife',
    '#WorkInProgress',
    '#NaijaTech',
    '#GrindMode',
  ];

  // Weekly manually updated trending hashtags (from Trends24 / GetDayTrends Nigeria)
  private trendingHashtags = [
    '#ElClasico',
    '#LiveWithChude',
    '#TensionByEazieBoi',
    '#MakemationInCinemas',
    '#JAMB',
    '#Barça',
    '#Yamal',
    '#Mbappe',
    '#Rudiger',
    '#Tottenham',
  ];
  /**
   * Randomly pick a hashtag (70% static, 30% trending)
   */
  async pickRandomHashtag(): Promise<string> {
    const useTrending = Math.random() < 0.3; // 30% chance to pick from trending

    if (useTrending && this.trendingHashtags.length > 0) {
      const randomTrending = Math.floor(Math.random() * this.trendingHashtags.length);
      return this.trendingHashtags[randomTrending];
    }

    const randomStatic = Math.floor(Math.random() * this.staticHashtags.length);
    return this.staticHashtags[randomStatic];
  }
}

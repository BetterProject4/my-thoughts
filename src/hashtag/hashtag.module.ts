import { Module } from '@nestjs/common';
import { HashtagService } from './hashtag.service';

@Module({
  providers: [HashtagService],
  exports: [HashtagService],
})
export class HashtagModule {}
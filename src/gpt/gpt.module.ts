import { forwardRef, Module } from '@nestjs/common';
import { GptService } from './gpt.service';
import { TwitterModule } from '../twitter/twitter.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    TwitterModule,
    forwardRef(() => TelegramModule),
  ],
  providers: [GptService],
  exports: [GptService],
})
export class GptModule {}

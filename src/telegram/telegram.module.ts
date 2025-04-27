import { forwardRef, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { GptModule } from '../gpt/gpt.module';

@Module({
  imports: [forwardRef(() => GptModule)],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}

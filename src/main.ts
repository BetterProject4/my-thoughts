import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

console.log(process.env.TWITTER_API_KEY)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

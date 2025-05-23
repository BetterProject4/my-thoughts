import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(process.env.TWITTER_ACCESS_SECRET)
    return 'Hello World!';
  }
}

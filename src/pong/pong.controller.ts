import { Controller, Get } from '@nestjs/common';

@Controller('pong')
export class PongController {
  @Get()
  async pong(): Promise<string> {
    await this.delay(2000);
    return 'pong';
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

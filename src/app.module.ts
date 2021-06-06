import { PongModule } from './pong/pong.module';
import { PongSocketModule } from './speed/pongsocket.module';
import { ConfigModule } from './common/config/config.module';
import { Module } from '@nestjs/common';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [ConfigModule, LoggerModule, PongSocketModule, PongModule],
})
export class AppModule {}

import { SpeedModule } from './speed/speed.module';
import { ConfigModule } from './common/config/config.module';
import { Module } from '@nestjs/common';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [ConfigModule, LoggerModule, SpeedModule],
})
export class AppModule {}

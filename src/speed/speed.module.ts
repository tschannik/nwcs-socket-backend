import { Module } from '@nestjs/common';
import { SpeedGateway } from './speed.gateway';

@Module({
  providers: [SpeedGateway],
})
export class SpeedModule {}

import { Module } from '@nestjs/common';
import { PongSocketGateway } from './pongsocket.gateway';

@Module({
  providers: [PongSocketGateway],
})
export class PongSocketModule {}

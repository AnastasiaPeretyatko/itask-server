import { Module } from '@nestjs/common';

import { MessageModule } from 'src/modules/message/message.module';

import { SocketGateway } from './socket.gateway';

@Module({
  providers: [SocketGateway],
  exports: [SocketGateway],
  imports: [MessageModule],
})
export class SocketModule {}

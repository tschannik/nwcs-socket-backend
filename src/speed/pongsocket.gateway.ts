import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Socket } from 'dgram';
@WebSocketGateway()
export class PongSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;
  wsClients = [];

  async handleConnection(client: any) {
    this.server.emit('control', 'login');
    console.log(client.handshake.headers.origin);
    this.wsClients.push(client);
    console.log('Created new connection', client.id);
    this.broadcastClients();
  }

  async handleDisconnect(client: Socket) {
    console.log('Disconnected client');
    for (let i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i] === client) {
        this.wsClients.splice(i, 1);
        break;
      }
    }
    this.broadcastClients();
    this.server.emit('control', 'logout');
  }

  @SubscribeMessage('Pang')
  async onPang(client: Socket) {
    console.log('Recieved ping, send pong');
    await this.delay(1000);
    client.emit('ServerPong');
  }

  @SubscribeMessage('sendBroadcast')
  async recieveBC(client: Socket, payload: any) {
    console.log('bc');
    this.broadcast(payload);
  }

  private broadcast(message: any) {
    const broadCastMessage = JSON.stringify(message);
    for (const c of this.wsClients) {
      c.emit('bc', broadCastMessage);
    }
  }

  private broadcastClients() {
    for (const c of this.wsClients) {
      c.emit(
        'broadClients',
        this.wsClients.map(c => c.id),
      );
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

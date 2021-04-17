import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Socket } from 'dgram';
@WebSocketGateway()
export class SpeedGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;
  wsClients = [];

  async handleConnection(client: any) {
    this.server.emit('control', 'login');
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

  @SubscribeMessage('pang')
  async onPing(client: Socket) {
    console.log('Recieved pang, send pong');
    client.emit('testpong');
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
}

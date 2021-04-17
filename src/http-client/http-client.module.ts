import { Module } from '@nestjs/common';
import { Agent as HttpsAgent } from 'https';
import { Agent as HttpAgent } from 'http';
import * as tunnel from 'tunnel';
import Axios from 'axios';
import { ConfigService } from '../common/config/config.service';
import { ConfigModule } from '../common/config/config.module';

const httpClientConfig = {
  timeout: 6e4,
  maxRedirects: 5,
  httpAgent: new HttpAgent({ keepAlive: true }),
  httpsAgent: new HttpsAgent({
    maxSockets: 100,
    keepAlive: true,
    maxFreeSockets: 30,
    timeout: 6e4,
    keepAliveMsecs: 6e4,
  }),
};

export const HTTP_CLIENT = 'AXIOS_HTTP_CLIENT';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: HTTP_CLIENT,
      useFactory: () => {
        return Axios.create(httpClientConfig);
      },
      inject: [ConfigService],
    },
  ],
  exports: [HTTP_CLIENT],
})
export class HttpClientModule {}

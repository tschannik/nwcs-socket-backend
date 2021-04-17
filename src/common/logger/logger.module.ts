import { ConfigService } from '../config/config.service';
import { Module, Global } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { decode } from 'jsonwebtoken';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      providers: [ConfigService],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          pinoHttp: {
            autoLogging: {
              ignorePaths: [],
            },
            formatters: {
              level: label => {
                return { level: label };
              },
            },
            useLevel:
              configService.nodeEnv === 'development' ? 'debug' : 'info',
            prettyPrint:
              configService.nodeEnv === 'development'
                ? {
                    colorize: true,
                    ignore: 'req,instanceId',
                  }
                : false,
            timestamp: true,
            serializers: {
              req(req) {
                // This could be a performance bottleneck
                // We decode the token to append user information to logs in production
                if (req.raw?.headers?.authorization) {
                  req.user = decode(
                    req.raw?.headers?.authorization?.replace('Bearer ', ''),
                  );
                } else {
                  req.user = req.raw.user;
                }
                req.headers = { ...req.headers, authorization: null };
                return req;
              },
            },
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class LoggerModule {}

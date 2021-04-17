import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { join } from 'path';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigModule } from './common/config/config.module';
import { ConfigService } from './common/config/config.service';
import { getCorsSettings } from './common/util/cors.settings';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useLogger(app.get(Logger));
  app.use(bodyParser.json({ limit: '110mb' }));
  app.use(bodyParser.urlencoded({ limit: '110mb', extended: true }));

  const configService = app
    .select(ConfigModule)
    .get(ConfigService, { strict: true });
  app.enableCors(getCorsSettings(configService.corsAllowedOrigins));

  const options = new DocumentBuilder()
    .setTitle(configService.appName)
    .addServer('/api')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(configService.swaggerPrefix, app, document);

  app.set('trust proxy', 2);

  app.use(compression());
  app.use(helmet());
  app.use(
    helmet.hsts({
      maxAge: 31536000,
      includeSubDomains: true,
    }),
  );

  app.useStaticAssets(join(__dirname, '../src/download'));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.setGlobalPrefix('/api');

  await app.listen(configService.port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

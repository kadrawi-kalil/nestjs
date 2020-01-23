import { NestFactory } from '@nestjs/core';
import { Logger ,Get } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';
import { request, ServerResponse } from 'http';

async function bootstrap() {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    app.enableCors();
    logger.log(`Accepting requests from origin "${serverConfig.origin}"`);
  }

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  
  logger.log(`Application listening on port ${port}`);
}
bootstrap();

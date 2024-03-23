import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { TOKEN_SERVICE } from './modules/auth/auth.constants';
import { TokenServiceInterface } from './modules/auth/interface/token-service.interface';
import { RoomWebsocketAdapter } from './modules/room/websocket/websocket.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const tokenService = app.get<TokenServiceInterface>(TOKEN_SERVICE);

  app.useWebSocketAdapter(new RoomWebsocketAdapter(app, tokenService));
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);

  await app.listen(configService.get('app.port'));
}

bootstrap();

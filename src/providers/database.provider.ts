import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          ...configService.get('database'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
})
export default class DatabaseProvider {}

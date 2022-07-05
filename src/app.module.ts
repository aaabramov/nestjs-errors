import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './exception.filter';

@Module({
  imports: [PrometheusModule.register()],
  providers: [
    makeCounterProvider({
      name: 'nestjs_errors',
      help: 'nestjs_errors',
      labelNames: ['domain', 'status'],
    }),
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}

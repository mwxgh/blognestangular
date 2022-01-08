import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { NotificationModule } from '@shared/components/notification';
import { ServeStaticModule } from '@nestjs/serve-static';
import configuration from '../../config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ComponentsModule } from './components/components.module';
import { SharedModule } from './shared/shared.module';
import { join } from 'path';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ComponentsModule,
    HttpModule,
    // NotificationModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log(join(__dirname, '..', 'public'));
  }
}

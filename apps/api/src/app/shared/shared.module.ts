/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApiResponseService } from './services/api-response/api-response.service';
import { Module, Global } from '@nestjs/common';
import { HashService } from './services/hash/hash.service';
import { NotificationModule } from './services/notification/notification.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailChannel } from './services/notification/channels/email/email.channel';
import { ExportXlsxService } from './services/export-xlsx/ExportXlsx.service';

@Global()
@Module({
  imports: [
    NotificationModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        channels: [
          EmailChannel.config({
            host: configService.get('MAIL_HOST'),
            port: configService.get('MAIL_PORT'),
            secure: Number(configService.get('MAIL_PORT')) === 465,
            auth: {
              user: configService.get('MAIL_USERNAME'),
              pass: configService.get('MAIL_PASSWORD'),
            },
          }),
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ApiResponseService, HashService, ExportXlsxService],
  exports: [ApiResponseService, HashService, ExportXlsxService],
})
export class SharedModule {}

import { ApiResponseService } from './api-response/api-response.service';
import { Module, Global } from '@nestjs/common';
import { HashService } from './hash/hash.service';
import { NotificationModule } from './notification/notification.module';
import { ExportXlsxService } from './export-xlsx/ExportXlsx.service';

@Global()
@Module({
  providers: [ApiResponseService, HashService, ExportXlsxService],
  exports: [ApiResponseService],
  imports: [NotificationModule],
})
export class ServicesModule {}

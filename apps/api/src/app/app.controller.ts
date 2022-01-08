import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { ApiResponseService } from './shared/services/api-response/api-response.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private response: ApiResponseService
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}

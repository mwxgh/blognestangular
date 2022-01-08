import { Controller, Get } from '@nestjs/common';
import { Auth } from '../../decorators/auth.decorator';
import { ApiResponseService } from '../../../../shared/services/api-response/api-response.service';
import { PermissionService } from '../../services/permission.service';
import { PermissionTransformer } from '../../transformers/permission.transformer';
import { IPaginationOptions } from '../../../../shared/services/pagination';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
@ApiTags('Permission')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('api/v1/permission')
export class PermissionController {
  constructor(private response: ApiResponseService, private permissionService: PermissionService) {}
  @Get()
  @Auth('admin')
  async index(): Promise<any> {
    const params: IPaginationOptions = {
      limit: 10000,
      page: 1,
    };
    const query_builder = this.permissionService.repository.createQueryBuilder('permission').leftJoinAndSelect('permission.permissionGroup', 'permissionGroup');
    const data = await this.permissionService.paginate(query_builder, params);
    return this.response.paginate(data, new PermissionTransformer(['permissionGroup']));
  }
}

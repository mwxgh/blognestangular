import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { getCustomRepository } from 'typeorm';
import { ApiResponseService } from '../../../shared/services/api-response/api-response.service';
import { HashService } from '../../../shared/services/hash/hash.service';
import { IPaginationOptions } from '../../../shared/services/pagination';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/entities/role.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ListUserQueryParam } from '../dto/user.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { UserTransformer } from '../transformers/user.transformer';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/v1/user')
export class UserController {
  constructor(
    private userService: UserService,
    private response: ApiResponseService,
    private hashService: HashService
  ) {}

  @Get()
  @Auth('admin')
  async index(@Query() query: ListUserQueryParam): Promise<any> {
    const params: IPaginationOptions = {
      limit: query.per_page ? query.per_page : 100,
      page: query.page ? query.page : 1,
    };
    let query_builder = getCustomRepository(UserRepository)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .orderBy('user.id', 'DESC');
    if (query.status) {
      query_builder = query_builder.andWhere('user.status = :status', {
        status: query.status,
      });
    }
    if (query.role) {
      query_builder = query_builder.andWhere('role.slug = :role', {
        role: query.role,
      });
    } else {
      query_builder = query_builder.andWhere('role.slug = :role', {
        role: Roles.user,
      });
    }
    if (query.search && query.search !== '') {
      query_builder = query_builder.andWhere('user.id LIKE :keyword', {
        keyword: `%${query.search}%`,
      });
    } else {
      query_builder = query_builder.orWhere('user.username LIKE :keyword', {
        keyword: `%${query.search}%`,
      });
    }
    if (query.includes) {
      const inclues = query.includes.split(',');
      for (const item of inclues) {
        query_builder = query_builder.leftJoinAndSelect(`user.${item}`, item);
      }
    }
    const result = await this.userService.paginate(query_builder, params);
    return this.response.paginate(
      result,
      new UserTransformer(query.includes ? query.includes.split(',') : [])
    );
  }
}

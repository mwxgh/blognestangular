import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Type } from 'class-transformer';

export class ListUserQueryParam {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  page: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  per_page: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  status: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  role: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty()
  @IsOptional()
  includes: string;
}

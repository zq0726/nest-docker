import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CommonPaginationQueryDto {
  @ApiProperty({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  @Expose() // 显式暴露默认值
  page: number = 1;

  @ApiProperty({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5000) // 限制最大每页数量
  @IsOptional()
  @Expose() // 显式暴露默认值
  size: number = 10;

  @ApiProperty({ required: false, default: 'createAt' })
  @IsOptional()
  @Expose() // 显式暴露默认值
  sortBy?: string;

  @ApiProperty({ required: false, default: 'DESC', enum: ['ASC', 'DESC'] })
  @IsOptional()
  @Expose() // 显式暴露默认值
  sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

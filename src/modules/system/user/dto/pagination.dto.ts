import { CommonPaginationQueryDto } from '@/common/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationQueryDto extends CommonPaginationQueryDto {
  @IsOptional()
  @ApiProperty({ example: 'admin', description: '用户名' })
  username: string;
}

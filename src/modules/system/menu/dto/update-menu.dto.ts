import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: '菜单类型不能为空' })
  @IsOptional()
  id: number;
}

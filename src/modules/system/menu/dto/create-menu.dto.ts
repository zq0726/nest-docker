import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: '菜单类型不能为空' })
  type: 1;

  @ApiProperty({ example: '系统管理' })
  @IsOptional()
  menuName: string;

  @ApiProperty({ example: '/system' })
  @IsOptional()
  path: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  father: number;

  @ApiProperty({ example: '' })
  @IsOptional()
  component: string;

  @ApiProperty({ example: '/test' })
  @IsOptional()
  defaultDirection: string;

  @ApiProperty({ example: 'Plus' })
  @IsOptional()
  icon: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  order: number;

  @ApiProperty({ example: true })
  @IsOptional()
  isRoute: boolean;

  @ApiProperty({ example: false })
  @IsOptional()
  hiddenRoute: boolean;

  @ApiProperty({ example: false })
  @IsOptional()
  cacheRoute: boolean;

  @ApiProperty({ example: '菜单新增' })
  @IsOptional()
  btnPermission: string;

  @ApiProperty({ example: 'sys:user:add' })
  @IsOptional()
  authorizeCode: string;
}

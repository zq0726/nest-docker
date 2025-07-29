import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: '管理员', description: '角色名称' })
  @IsNotEmpty({ message: '角色名称不能为空' })
  @IsString()
  roleName: string;

  @ApiProperty({ example: 'admin', description: '角色编码' })
  @IsNotEmpty({ message: '角色编码不能为空' })
  @IsString()
  roleCode: string;

  @ApiProperty({ example: '1,2,3,4', description: '角色菜单' })
  @IsOptional()
  rolePower?: string;

  @ApiProperty({ example: '角色介绍', description: '备注' })
  @IsOptional()
  remark?: string;
}

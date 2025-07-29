import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ example: '测试部门', description: '部门的名称' })
  @IsNotEmpty({ message: '部门名称不能为空' })
  @IsString()
  departmentName: string;

  @ApiProperty({ example: 'admin', description: '部门管理员' })
  @IsOptional()
  director: number;

  @ApiProperty({ example: '说点什么', description: '部门备注' })
  @IsOptional()
  remark: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'admin', description: '账号' })
  @IsNotEmpty({ message: '账号不能为空' })
  @IsString()
  account: string;

  @ApiProperty({ example: '123456', description: '用户密码' })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @ApiProperty({ example: '管理员', description: '昵称' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: '18534813461', description: '手机号' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: '', description: '头像' })
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: '', description: '邮箱' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '', description: '角色' })
  role?: string;

  @ApiProperty({ example: true, description: '是否使用' })
  @IsOptional()
  @IsBoolean({})
  isActive?: boolean;
}

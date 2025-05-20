import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor) // 控制器级别应用
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 创建用户
   * @param createUserDto
   * @returns
   */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * 获取所有用户
   * @returns
   */
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * 通过 id 获取某个用户
   * @param id
   * @returns
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  /**
   * 通过id 修改用户信息
   * @param id
   * @param updateUserDto
   * @returns
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  /**
   * 通过id删除某个用户
   * @param id
   * @returns
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
  // UseInterceptors,
  // ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserVo } from './vo/create-user.vo';
import { LoginDto } from './dto/login-dto';
import { LoginVo } from './vo/login.vo';
import { Public } from '@/common/decorator/public/public.decorator';
import { Captcha } from './interfance/login';
import { PaginationQueryDto } from './dto/pagination.dto';
import { User } from './entities/user.entity';
import { PaginationResult } from '@/type/common';

@ApiTags('用户模块')
@Controller('user')
// @UseInterceptors(ClassSerializerInterceptor) // 控制器级别应用
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 创建用户
   * @param createUserDto
   * @returns
   */
  @ApiOperation({ summary: '添加用户' })
  @Post()
  @ApiOkResponse({ example: '请求成功', type: CreateUserVo })
  create(@Body() createUserDto: CreateUserDto, @Request() request) {
    return this.userService.create(createUserDto, request.user.account);
  }

  /**
   * 获取所有用户
   * @returns
   */
  @ApiOperation({ summary: '获取用户' })
  @Get()
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Request() request,
  ): Promise<PaginationResult<User>> {
    console.log('request', request.user.account);

    return this.userService.findAll(paginationQuery);
  }

  /**
   * 通过 id 获取某个用户
   * @param id
   * @returns
   */
  @ApiOperation({ summary: '通过id获取用户' })
  @Get('/byId')
  findOne(@Query('id') id: string) {
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
  @Get('/delete')
  remove(@Query('id') id: string) {
    return this.userService.remove(+id);
  }

  @Public()
  @ApiOperation({ summary: '登录' })
  @ApiOkResponse({ example: '登录成功', type: LoginVo })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Public()
  @Get('captcha')
  getCaptcha(): Promise<Captcha> {
    return this.userService.getCaptcha();
  }
}

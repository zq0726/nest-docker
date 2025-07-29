import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PaginationQueryDto } from './dto/pagination.dto';
import { UserService } from '../user/user.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('角色模块')
@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: '添加角色' })
  @Post()
  @ApiOkResponse({ example: '请求成功', type: CreateRoleDto })
  create(@Body() createRoleDto: CreateRoleDto, @Request() request) {
    return this.roleService.create(
      createRoleDto,
      request?.user?.account ?? 'admin',
    );
  }

  @ApiOperation({ summary: '分页获取用户列表' })
  @Get()
  findAllByPage(
    @Query() paginationQuery: PaginationQueryDto,
    @Request() request,
  ) {
    return this.roleService.findAllByPage(
      paginationQuery,
      request?.user?.account ?? 'admin',
    );
  }

  @Get('/all')
  findAll() {
    return this.roleService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(+id);
  }
}

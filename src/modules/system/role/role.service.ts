import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository, SelectQueryBuilder, In } from 'typeorm';
import { ApiException } from '@/common/filter/http-exception/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-code.enum';
import { PaginationQueryDto } from './dto/pagination.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto, createBy: string) {
    const { roleName, roleCode } = createRoleDto;

    const hasRoleName = await this.roleRepository.findOne({
      where: { roleName },
    });

    if (hasRoleName) {
      throw new ApiException('角色名称已存在', ApiErrorCode.ROLE_NAME_EXIST);
    }

    const hasRoleCode = await this.roleRepository.findOne({
      where: { roleCode },
    });

    if (hasRoleCode) {
      throw new ApiException('角色编码已存在', ApiErrorCode.ROLE_CODE_EXIST);
    }

    const params = {
      ...createRoleDto,
      createBy,
    };

    console.log('params', params);

    await this.roleRepository.save(params);
  }

  // 获取所有角色
  findAll() {
    return this.roleRepository.find();
  }

  // 分页获取所有用户
  async findAllByPage(paginationQuery: PaginationQueryDto, account?: string) {
    const {
      page = 1,
      size = 10,
      sortBy = 'createAt',
      sortOrder = 'DESC',
    } = paginationQuery;

    const queryBuilder: SelectQueryBuilder<Role> =
      this.roleRepository.createQueryBuilder('role');

    if (sortBy) {
      queryBuilder.orderBy(`role.${sortBy}`, sortOrder);
    }
    // 非 admin 用户不显示admin
    if (account !== 'admin') {
      queryBuilder.where("role.roleCode != 'admin'");
    }

    const [data, total] = await queryBuilder
      .take(size)
      .skip((page - 1) * size)
      .getManyAndCount();

    const totalPages = Math.ceil(total / size);
    return {
      data,
      total,
      page,
      size,
      totalPages,
    };
  }

  // 修改角色信息
  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.roleRepository.update(id, updateRoleDto);
  }

  // 删除某个角色
  async remove(id: number) {
    return this.roleRepository.delete(id);
  }

  // 获取某些角色
  async getRoleById(id: string) {
    const ids = id.split(',').map(Number);

    return await this.roleRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}

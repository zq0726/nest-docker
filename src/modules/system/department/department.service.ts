import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}
  async create(createDepartmentDto: CreateDepartmentDto, createBy: string) {
    const saveInfo = {
      ...createDepartmentDto,
      createBy,
    };

    return await this.departmentRepository.save(saveInfo);
  }

  //获取部门列表
  async findAll(paginationQuery: PaginationQueryDto) {
    const {
      page = 1,
      size = 10,
      sortBy = 'createAt',
      sortOrder = 'DESC',
    } = paginationQuery;

    const queryBuilder = this.departmentRepository
      .createQueryBuilder('d')
      .leftJoin(User, 'u', 'u.id = d.director')
      .select([
        'd.id as id',
        'd.departmentName as departmentName',
        'd.remark as remark',
        'd.createBy as createBy',
        'd.director as director',
        'DATE_FORMAT(d.createAt, "%Y-%m-%d %H:%i:%s") AS createAt',
        'u.username as directorName',
      ])
      .take(size)
      .skip((page - 1) * size)
      .orderBy(`d.${sortBy}`, sortOrder);

    const [data, total] = await Promise.all([
      queryBuilder.getRawMany(),
      this.departmentRepository.count(),
    ]);

    return {
      data,
      total,
      page,
      size,
      totalPages: total > 0 ? Math.ceil(total / size) : 0,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} department`;
  }

  update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return this.departmentRepository.update(id, updateDepartmentDto);
  }

  remove(id: number) {
    return this.departmentRepository.delete(id);
    // return `This action removes a #${id} department`;
  }
}

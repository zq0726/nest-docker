import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination.dto';
import { ApiException } from '@/common/filter/http-exception/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-code.enum';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
  ) {}
  async create(createMenuDto: CreateMenuDto) {
    const hasPath = await this.menuRepository.findOne({
      where: { path: createMenuDto.path },
    });
    if (hasPath) {
      throw new ApiException('路由已存在', ApiErrorCode.MENU_PATH_EXIST);
    }

    console.log('createMenuDto', createMenuDto);

    // return await this.menuRepository.save(createMenuDto);
  }

  /**
   * 获取菜单列表
   * @param paginationQuery
   * @returns
   */
  async findAllByPagination(paginationQuery: PaginationQueryDto) {
    const {
      page = 1,
      size = 10,
      sortBy = 'order',
      sortOrder = 'ASC',
    } = paginationQuery;

    const [data, total] = await this.menuRepository.findAndCount({
      where: { father: 0 },
      skip: (page - 1) * size,
      take: size,
      order: { [sortBy]: sortOrder },
    });

    const tree = await this.buildMenuTree(data);

    return {
      data: tree,
      total,
      page,
      size,
    };
  }

  private async buildMenuTree(menus: Menu[]) {
    const tree: any = [];
    for (const menu of menus) {
      const info: any = { ...menu };
      const children = await this.menuRepository.find({
        where: { father: menu.id },
        order: {
          order: 'ASC',
        },
      });

      if (children.length > 0) {
        info.children = await this.buildMenuTree(children);
      }

      tree.push(info);
    }
    return tree;
  }

  /**
   * 获取所有菜单
   * @param id
   * @param updateMenuDto
   * @returns
   */
  async findAll() {
    return await this.menuRepository.find();
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    return await this.menuRepository.update(id, updateMenuDto);
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}

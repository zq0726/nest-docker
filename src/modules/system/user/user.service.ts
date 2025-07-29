import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { decrypt, encrypt } from '@/utils/bcrypt';
import { ApiException } from '@/common/filter/http-exception/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-code.enum';
import { LoginDto } from './dto/login-dto';
import { JwtService } from '@nestjs/jwt';
import { generateCaptcha } from '@/utils/generateCaptcha';
import { CacheService } from '@/cache/cache.service';
import { PaginationQueryDto } from './dto/pagination.dto';
import { UploadService } from '../../upload/upload.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private cacheService: CacheService,
    private uploadService: UploadService,
    private roleService: RoleService,
  ) {}

  /**
   * 创建用户
   * @param createUserDto
   * @returns
   */
  async create(createUserDto: CreateUserDto, createBy: string) {
    const { account, password, phone } = createUserDto;
    const existUser = await this.userRepository.findOneBy({
      account,
    });

    if (existUser) {
      throw new ApiException('用户已存在', ApiErrorCode.USER_EXIST);
    }

    if (phone) {
      const existPhone = await this.userRepository.findOneBy({
        phone,
      });

      if (existPhone) {
        throw new ApiException('手机号已存在', ApiErrorCode.USER_PHONE_EXIST);
      }
    }

    const savePwd = encrypt(password);
    const saveInfo = {
      ...createUserDto,
      password: savePwd,
      createBy,
    };
    await this.userRepository.save(saveInfo);
    return '添加成功';
  }

  /**
   * 分页获取用户信息
   * @returns
   */
  async findAll(paginationQuery: PaginationQueryDto, account?: string) {
    const {
      page = 1,
      size = 10,
      sortBy = 'createAt',
      sortOrder = 'DESC',
      username,
    } = paginationQuery;

    const queryBuilder: SelectQueryBuilder<User> =
      this.userRepository.createQueryBuilder('user');

    // 添加基础排序
    if (sortBy) {
      queryBuilder.orderBy(`user.${sortBy}`, sortOrder);
    }

    // 非 admin 用户过滤
    if (account !== 'admin') {
      queryBuilder.where("user.account != 'admin'");
    }

    // 模糊查询
    if (username) {
      queryBuilder.andWhere('user.username LIKE :username', {
        username: `%${username}%`,
      });
    }

    const [data, total]: any = await queryBuilder
      .select([
        'user.id',
        'user.username',
        'user.account',
        'user.phone',
        'user.avatar',
        'user.email',
        'user.role', // 直接返回 roleId（原始值）
        'user.isActive',
        'user.createBy',
        'user.createAt',
      ])
      .take(size)
      .skip((page - 1) * size)
      .getManyAndCount();

    for (let i = 0; i < data.length; i++) {
      if (data[i].role) {
        const roleList = await this.roleService.getRoleById(data[i].role);
        data[i].roleInfo = roleList;
      }
    }

    const totalPages = total > 0 ? Math.ceil(total / size) : 0;
    return {
      data,
      total,
      page,
      size,
      totalPages,
    };
  }

  // 通过id查找某个用户
  async findOne(id: number) {
    const res = await this.userRepository.findOne({ where: { id } });
    return res;
  }

  // 修改某个用户的数据
  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  // 删除某个用户
  async remove(id: number) {
    try {
      const user = await this.findOne(id);
      if (user) {
        this.uploadService.deleteFile(user.avatar);
      }

      return await this.userRepository.delete(id);
    } catch (error) {
      console.log('error', error);
    }
    // this.uploadService.deleteFile()
  }

  //通过角色获取用户
  async roleUser(role: string) {
    console.log('roleID', role);
    return await this.userRepository
      .createQueryBuilder('user')
      .where('FIND_IN_SET(:role,user.role)', { role })
      .getMany();
  }

  async userAll() {
    return await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.username'])
      .getMany();
  }

  /**
   * 登录接口
   * @param loginDto
   * @returns
   */
  async login(loginDto: LoginDto) {
    const { account, password, captcha } = loginDto;

    const captchaText = await this.cacheService.get('captchaText');
    if (!captcha)
      throw new ApiException(
        '验证码已过期，请重新获取',
        ApiErrorCode.CAPTCHA_EXPIRE,
      );
    if (
      (captchaText as unknown as string).toLocaleUpperCase() !=
      captcha.toLocaleUpperCase()
    )
      throw new ApiException('验证码错误', ApiErrorCode.CAPTCHA_ERROR);
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.account', 'user.password'])
      .where({ account })
      .getOne();

    if (!user)
      throw new ApiException('用户不存在', ApiErrorCode.USER_NOT_EXIST);

    const isExist = decrypt(password, user.password);
    if (!isExist)
      throw new ApiException('用户或密码错误', ApiErrorCode.USER_NOT_EXIST);

    const payload = { account, sub: user.id };
    const token = await this.jwtService.signAsync(payload);
    await this.cacheService.set(token, token, 7200);
    return {
      token,
    };
  }

  /**
   * 获取验证码
   */
  async getCaptcha() {
    const { id, captcha } = generateCaptcha();
    const captchaText = captcha.text;

    await this.cacheService.set('captchaText', captchaText);
    return { id, img: captcha.data };
  }
}

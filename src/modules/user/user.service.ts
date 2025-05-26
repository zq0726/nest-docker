import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { decrypt, encrypt } from '@/utils/bcrypt';
import { ApiException } from '@/common/filter/http-exception/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-code.enum';
import { LoginDto } from './dto/login-dto';
import { JwtService } from '@nestjs/jwt';
import { generateCaptcha } from '@/utils/generateCaptcha';
import { CacheService } from '@/cache/cache.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private cacheService: CacheService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    console.log('createUserDto', createUserDto);
    const { account, password } = createUserDto;
    const existUser = await this.userRepository.findOneBy({
      account,
    });

    if (existUser) {
      throw new ApiException('用户已存在', ApiErrorCode.USER_EXIST);
    }

    const savePwd = encrypt(password);
    const saveInfo = { ...createUserDto, password: savePwd };
    await this.userRepository.save(saveInfo);

    return {
      code: 200,
      message: '添加成功',
    };
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    console.log('id', id);
    const res = await this.userRepository.findOne({ where: { id } });
    console.log('res', res);
    return res;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log('id', id);
    console.log('updateUserDto', updateUserDto);
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
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

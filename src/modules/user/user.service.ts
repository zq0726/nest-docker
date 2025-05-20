import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { encrypt } from '@/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    console.log('createUserDto', createUserDto);
    const { account, password } = createUserDto;
    const personInfo = await this.userRepository.findOneBy({
      account,
    });
    console.log('personInfo', personInfo);
    if (personInfo) {
      return {
        code: 400,
        message: '用户已存在',
      };
    }

    const savePwd = encrypt(password);
    console.log('savePwd', savePwd);
    const saveInfo = { ...createUserDto, password: savePwd };
    await this.userRepository.save(saveInfo);

    return {
      code: 200,
      message: '添加成功',
    };
  }

  async findAll() {
    const userInfo = await this.userRepository.find();
    return {
      code: 200,
      data: userInfo,
    };
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
}

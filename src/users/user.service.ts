import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  findAll() {
    return this.userRepository.find({ relations: ['posts'] });
  }

  findOne(id: number) {
    return this.userRepository.findOneOrFail({
      where: { id },
      relations: ['posts'],
    });
  }

  async create(data: CreateUserDto) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = this.userRepository.create({
      ...data,
      password: hashed,
      role: data.role || 'user',
      isActive: data.isActive ?? true,
    });
    return this.userRepository.save(user);
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('user not found');
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  async delete(id: number) {
    await this.userRepository.delete(id);
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('user not found');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('password incorrect');
    const token = this.jwtService.sign(
      { sub: user.id, role: user.role, email: user.email },
      { secret: 'SECRET_JWT_KEY', expiresIn: '1d' },
    );
    return { access_token: token };
  }
}

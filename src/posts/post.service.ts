import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../users/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  findAll() {
    return this.postRepo.find({ relations: ['user'] });
  }

  findOne(id: number) {
    return this.postRepo.findOneOrFail({ where: { id }, relations: ['user'] });
  }

  async create(data: CreatePostDto, userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('user not found');
    const post = this.postRepo.create({ ...data, user });
    return this.postRepo.save(post);
  }

  async update(id: number, data: UpdatePostDto) {
    const post = await this.postRepo.findOne({ where: { id }, relations: ['user'] });
    if (!post) throw new NotFoundException('post not found');
    Object.assign(post, data);
    return this.postRepo.save(post);
  }

  async delete(id: number) {
    await this.postRepo.delete(id);
  }
}

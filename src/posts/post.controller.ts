import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseFilters, Request, UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { EntityNotFoundExceptionFilter } from './entity-not.found-exception.filter';
import { CreatePostDto } from './create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';

@Controller('posts')
@UseFilters(EntityNotFoundExceptionFilter)
export class PostController {
  constructor(private readonly postService: PostService) {}

  // get all posts
  @Get()
  async findAll() {
    return {
      data: await this.postService.findAll(),
    };
  }

  // get post by id
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return {
      data: await this.postService.findOne(id),
    };
  }

  // create new post
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: CreatePostDto, @Request() req) {
    const userId = req.user.sub;
    return {
      data: await this.postService.create(data, userId),
    };
  }

  // update post by id
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: number, @Body() data: UpdatePostDto) {
    return {
      data: await this.postService.update(id, data),
    };
  }

  // delete post by id
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.postService.delete(id);
  }
}

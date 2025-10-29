import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseFilters,
} from '@nestjs/common';
import { UserService } from './user.service';
import { EntityNotFoundExceptionFilter } from './entity-not.found-exception.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseFilters(EntityNotFoundExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // get all users
  @Get()
  async findAll() {
    return {
      data: await this.userService.findAll(),
    };
  }

  // get user by id
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return {
      data: await this.userService.findOne(id),
    };
  }

  // register new user
  @Post()
  async create(@Body() data: CreateUserDto) {
    return {
      data: await this.userService.create(data),
    };
  }

  // login
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.userService.login(body.email, body.password);
  }

  // update user by id
  @Put(':id')
  async update(@Body() data: UpdateUserDto, @Param('id') id: number) {
    return {
      data: await this.userService.update(id, data),
    };
  }

  // delete user by id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number) {
    await this.userService.delete(id);
  }
}

import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorators/auth.decorator';
import { Role } from '../auth/constants/auth.constant';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(Role.Admin)
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Create new user, only available for Admin role',
  })
  async createUser(@Body() user: CreateUserDto) {
    const result = await this.usersService.createNewUser(user);
    return { data: result };
  }

  @Get('/me')
  @ApiResponse({ status: 200, description: 'Get info of current user' })
  async getSelfInfo(@Request() req) {
    const username = req.user.username;
    return { data: await this.usersService.getUserInfo(username) };
  }

  @Roles(Role.Admin)
  @ApiResponse({ status: 200, description: 'Get all users' })
  @Get()
  async getAllUsers() {
    return { data: await this.usersService.getAll() };
  }
}

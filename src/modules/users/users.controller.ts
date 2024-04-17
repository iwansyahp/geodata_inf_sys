import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, GetUserInfoResponse } from './dto/user.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorators/role.decorators';
import { Role } from '../auth/constants/role.constant';

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
  createUser(@Body() user: CreateUserDto) {
    return this.usersService.createNewUser(user);
  }

  @Get('/me')
  @ApiResponse({ status: 200, description: 'Get info of current user' })
  getSelfInfo(@Request() req): Promise<GetUserInfoResponse> {
    const username = req.user.username;
    return this.usersService.getUserInfo(username);
  }

  @Roles(Role.Admin)
  @ApiResponse({ status: 200, description: 'Get all users' })
  @Get()
  getAllUsers(): Promise<GetUserInfoResponse[]> {
    return this.usersService.getAll();
  }
}

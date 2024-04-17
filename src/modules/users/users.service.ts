import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto, GetUserInfoResponse } from './dto/user.dto';
import { User } from './models/user.model';

import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/sequelize';
import { mapUserToResponse } from './utils/user_mapper';
import { Role } from '../auth/constants/role.constant';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findOneByUserName(username: string): Promise<User | undefined> {
    const user = this.userModel.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }
  async createNewUser(userDto: CreateUserDto): Promise<User> {
    const newUser = {
      username: userDto.username,
      full_name: userDto.full_name,
      password: await bcrypt.hash(userDto.password, 10), // hash userDto.password,
      role: Role.User.toString(), // by default, new user will be assigned with role User
    };

    return this.userModel.create(newUser);
  }

  async getAll(): Promise<GetUserInfoResponse[]> {
    const users = await this.userModel.findAll();
    return users.map((user) => mapUserToResponse(user));
  }

  async getUserInfo(username: string): Promise<GetUserInfoResponse> {
    const user = await this.findOneByUserName(username);

    return mapUserToResponse(user);
  }
}

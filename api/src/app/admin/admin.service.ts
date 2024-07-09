import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserResponse } from '../users/interfaces/user.interface';

@Injectable()
export class AdminService {
  constructor(private readonly usersService: UsersService) {}

  async findAllUsers(): Promise<UserResponse[]> {
    const users = await this.usersService.findAll();
    return users;
  }
}

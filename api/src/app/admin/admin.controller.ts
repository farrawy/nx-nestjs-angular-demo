import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from '../users/users.service';
import { Roles } from '../auth/decorators/role.decorator';
import { UserResponse } from '../users/interfaces/user.interface';
import { UserRole } from '../users/user.schema';
import { SearchUserDto } from '../users/dto/user.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  @Roles('admin')
  async findAllUsers(): Promise<UserResponse[]> {
    console.log('Admin route hit'); // Log for debugging
    const users = await this.usersService.findAll();
    console.log('All users for admin:', users);
    return users;
  }

  @Put('users/:id/role')
  @Roles('admin')
  async updateUserRole(
    @Param('id') userId: string,
    @Body('role') role: UserRole
  ): Promise<UserResponse> {
    console.log(`Updating role for user ${userId} to ${role}`); // Log for debugging
    return this.usersService.updateRole(userId, role);
  }

  @Get('search')
  async searchUsers(@Query() query: SearchUserDto): Promise<UserResponse[]> {
    const searchParams: any = {};

    if (query.email) {
      searchParams.email = query.email;
    }
    if (query.name) {
      searchParams.name = query.name;
    }
    if (query.role) {
      searchParams.role = query.role;
    }
    if (query.isActive !== undefined && query.isActive !== '') {
      searchParams.isActive = query.isActive === 'true' ? true : false;
    }

    return this.usersService.searchUsers(searchParams);
  }

  @Put('users/:id/activate')
  @Roles('admin')
  async activateUser(@Param('id') userId: string): Promise<UserResponse> {
    console.log(`Activating user ${userId}`); // Log for debugging
    return this.usersService.activateUser(userId);
  }

  @Put('users/:id/deactivate')
  @Roles('admin')
  async deactivateUser(@Param('id') userId: string): Promise<UserResponse> {
    console.log(`Deactivating user ${userId}`); // Log for debugging
    return this.usersService.deactivateUser(userId);
  }
}

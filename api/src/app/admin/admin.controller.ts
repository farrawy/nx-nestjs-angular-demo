import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UsersService } from '../users/users.service';
import { Roles } from '../auth/decorators/role.decorator';
import { UserResponse } from '../users/interfaces/user.interface';
import { UserRole } from '../users/user.schema';

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

  @Patch('users/:id/role')
  @Roles('admin')
  async updateUserRole(
    @Param('id') userId: string,
    @Body('role') role: UserRole
  ): Promise<UserResponse> {
    console.log(`Updating role for user ${userId} to ${role}`); // Log for debugging
    return this.usersService.updateRole(userId, role);
  }
}

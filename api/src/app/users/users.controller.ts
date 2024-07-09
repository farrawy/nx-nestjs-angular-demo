import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { RequestWithUser, UserResponse } from './interfaces/user.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    console.log('users controller');
  }

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(): string {
    return 'login';
  }

  @Put('profile')
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponse> {
    const user = await this.usersService.findOne(req.user.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.usersService.update(user._id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('all-users')
  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.usersService.findAll();
    return users;
  }
}

import {
  Body,
  Controller,
  NotFoundException,
  Patch,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { RequestWithUser, UserResponse } from './interfaces/user.interface';

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
}

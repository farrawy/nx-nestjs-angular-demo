import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserResponse } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';

interface RequestWithUser extends Request {
  user: UserResponse;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Request() req: RequestWithUser
  ): Promise<{ access_token: string }> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req: RequestWithUser): Omit<UserResponse, 'password'> {
    const user = req.user as any;
    const userObject = user.toObject ? user.toObject() : user;
    delete userObject.password;
    return userObject;
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.authService.register(createUserDto);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body('email') email: string
  ): Promise<{ token: string }> {
    const token = await this.authService.forgotPassword(email);
    return { token };
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('password') password: string
  ): Promise<string> {
    try {
      await this.authService.resetPassword(token, password);
      return `Password reset successfully`;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}

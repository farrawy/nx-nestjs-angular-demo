import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto, UpdateUserDto } from '../users/dto/user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserResponse } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/user.schema';

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
  ): Promise<{ access_token: string; expires_in: number }> {
    return this.authService.login(req.user);
  }


  @UseGuards(JwtAuthGuard)
  @Post('profile')
  getProfile(@Request() req: RequestWithUser): Omit<UserResponse, 'password'> {
    const user = req.user as UserDocument;
    const userObject = user;
    return this.usersService.toResponse(userObject);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateUserDto
  ): Promise<UserResponse> {
    console.log(`Request user: ${JSON.stringify(req.user)}`); // Log for debugging
    if (!req.user || !req.user._id) {
      throw new Error(
        'User information is not correctly attached to the request.'
      );
    }
    const userId = req.user._id;
    console.log(`Updating profile for user ${userId}`); // Log for debugging
    return this.usersService.update(userId, updateProfileDto);
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

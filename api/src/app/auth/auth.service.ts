import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import { UserResponse } from '../users/interfaces/user.interface';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

import { CreateUserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.usersService.create(createUserDto);
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new Error('User not found');
    }
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    return token;
  }

  async resetPassword(token: string, password: string): Promise<void> {
    const user = await this.usersService.findOneByResetToken(token);
    if (!user || user.resetPasswordExpires < new Date()) {
      throw new Error('Password reset token is invalid or has expired');
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }

  async validateUser(
    email: string,
    password: string
  ): Promise<UserResponse | null> {
    const user = await this.usersService.validateUserPassword(email, password);
    if (user) {
      return this.usersService.toResponse(user);
    }
    return null;
  }

  async login(
    user: UserResponse
  ): Promise<{ access_token: string; expires_in: number }> {
    const payload = { email: user.email, sub: user._id, role: user.role };

    const access_token = this.jwtService.sign(payload);
    const expires_in = 8 * 60 * 60; // 8 hours

    return { access_token, expires_in };
  }
}

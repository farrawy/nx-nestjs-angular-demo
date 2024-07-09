import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument, UserRole } from './user.schema';
import { UserResponse } from './interfaces/user.interface';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    const createdUser = await user.save();
    const { password, ...result } = createdUser.toObject();
    return { ...result, _id: result._id.toString() } as UserResponse;
  }

  async findOne(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userModel.find().exec();
    console.log('Fetched users:', users);
    return users.map((user) => this.toResponse(user));
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findOneByResetToken(token: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      })
      .exec();
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto
  ): Promise<UserResponse> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      updateUserDto.password = hashedPassword;
    }

    Object.assign(user, updateUserDto);
    await user.save();

    return this.toResponse(user);
  }

  async validateUserPassword(
    email: string,
    password: string
  ): Promise<UserDocument | null> {
    // Find the user with the given email.
    const user = await this.findOne(email);

    // If the user is found, check if the password matches the hashed password in the database.
    // If the password matches, return the user document.
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    // If the user is not found or the password does not match, return null.
    return null;
  }

  toResponse(user: UserDocument): UserResponse {
    const { _id, email, createdAt, isActive, role } = user.toObject();
    return { _id: _id.toString(), email, createdAt, isActive, role };
  }

  async updateRole(userId: string, role: UserRole): Promise<UserResponse> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = role;
    await user.save();
    return this.toResponse(user);
  }
}
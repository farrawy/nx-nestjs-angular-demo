import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { UserRole } from '../user.schema';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class SearchUserDto {
  @IsOptional()
  @IsString()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  readonly role?: UserRole;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: string;
}

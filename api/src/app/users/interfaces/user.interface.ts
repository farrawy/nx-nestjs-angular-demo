import { Request } from '@nestjs/common';

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  isActive: boolean;
  role: string;
}

export interface RequestWithUser extends Request {
  user: UserResponse;
}

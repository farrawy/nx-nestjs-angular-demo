export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
  isActive: boolean;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user: UserResponse;
}

export interface UserProfile {
  _id: string;
  email: string;
  isActive: boolean;
  role: string;
  createdAt: string;
  __v: number;
  name: string;
}

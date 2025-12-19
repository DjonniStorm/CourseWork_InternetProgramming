const enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

interface UserCreate {
  email: string;
  username: string;
  password: string;
}

interface UserLogin {
  email: string;
  password: string;
}

interface UserResponse {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
}

interface UserUpdate {
  email: string;
  username: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  userId: string;
  email: string;
  username: string;
}

export type { AuthResponse, UserCreate, UserLogin, UserResponse, UserRole, UserUpdate };

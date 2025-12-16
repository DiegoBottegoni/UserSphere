import { User } from '@prisma/client';
import { UpdateUserDTO } from './dto';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(data: {
    name: string;
    email: string;
    passwordHash?: string;
    googleId?: string;
  }): Promise<User>;
  update(
    id: string,
    data: Partial<UpdateUserDTO> & {
      passwordHash?: string;
      profileUpdatedAt?: Date;
      isOnline?: boolean;
      lastLoginAt?: Date;
      lastSeenAt?: Date;
      googleId?: string;
    }
  ): Promise<User>;
  delete(id: string): Promise<void>;
  searchByNameOrEmail(query: string): Promise<User[]>;
}

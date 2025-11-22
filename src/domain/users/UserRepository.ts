import { User } from '@prisma/client';
import { UpdateUserDTO } from './dto';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(data: { name: string; email: string; passwordHash: string }): Promise<User>;
  update(id: string, data: Partial<UpdateUserDTO> & { passwordHash?: string; profileUpdatedAt?: Date }): Promise<User>;
  delete(id: string): Promise<void>;
}


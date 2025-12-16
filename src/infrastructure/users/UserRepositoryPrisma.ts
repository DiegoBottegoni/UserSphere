import { prisma } from '@/infrastructure/prisma/client';
import { UserRepository } from '@/domain/users/UserRepository';
import { User } from '@prisma/client';
import { UpdateUserDTO } from '@/domain/users/dto';

export class UserRepositoryPrisma implements UserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async create(data: {
    name: string;
    email: string;
    passwordHash?: string;
    googleId?: string;
  }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async update(
    id: string,
    data: Partial<UpdateUserDTO> & {
      passwordHash?: string;
      profileUpdatedAt?: Date;
      isOnline?: boolean;
      lastLoginAt?: Date;
      lastSeenAt?: Date;
      googleId?: string;
    }
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async searchByNameOrEmail(query: string): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20, // Limit results to 20 users
    });
  }
}

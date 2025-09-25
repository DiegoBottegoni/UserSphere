import { prisma } from '../../infrastructure/prisma/client';
import { UserResponseDTO } from '../../domain/users/dto/UserResponseDTO';
import { CreateUserDTO } from '../../domain/users/dto/CreateUserDTO';
import { UpdateUserDTO } from '../../domain/users/dto/UpdateUserDTO';
import bcrypt from 'bcryptjs';

export const getUserById = async (id: string): Promise<UserResponseDTO> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error('User not found');

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isOnline: user.isOnline,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const getAllUsers = async (): Promise<UserResponseDTO[]> => {
  const users = await prisma.user.findMany();
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    isOnline: user.isOnline,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
};

export const createUser = async (data: CreateUserDTO): Promise<UserResponseDTO> => {
  const { name, email, password } = data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
      // isOnline, createdAt, updatedAt se manejan por default
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isOnline: user.isOnline,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};


export const updateUser = async (id: string, data: UpdateUserDTO): Promise<UserResponseDTO> => {
  const { password, ...rest } = data;
  const updateData: any = { ...rest };

  if (password) {
    updateData.passwordHash = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isOnline: user.isOnline,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};


export const deleteUser = async (id: string): Promise<void> => {
  await prisma.user.delete({ where: { id } });
};

import { prisma } from '../../infrastructure/prisma/client';
import { UserResponseDTO } from '../../domain/users/dto/UserResponseDTO';

export const getUserById = async (id: string): Promise<UserResponseDTO> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error('User not found');
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

import { UserRepositoryPrisma } from '@/infrastructure/users/UserRepositoryPrisma';
import { UserResponseDTO, CreateUserDTO, UpdateUserDTO } from '@/domain/users/dto';
import bcrypt from 'bcryptjs';

const userRepository = new UserRepositoryPrisma();

export const getUserById = async (id: string): Promise<UserResponseDTO> => {
  const user = await userRepository.findById(id);
  if (!user) throw new Error('User not found');

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isOnline: user.isOnline,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    profileUpdatedAt: user.profileUpdatedAt,
    lastLoginAt: user.lastLoginAt,
    lastSeenAt: user.lastSeenAt,
  };
};

export const getAllUsers = async (): Promise<UserResponseDTO[]> => {
  const users = await userRepository.findAll();
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    isOnline: user.isOnline,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    profileUpdatedAt: user.profileUpdatedAt,
    lastLoginAt: user.lastLoginAt,
    lastSeenAt: user.lastSeenAt,
  }));
};

export const createUser = async (data: CreateUserDTO): Promise<UserResponseDTO> => {
  const { name, email, password } = data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.create({
    name,
    email,
    passwordHash: hashedPassword,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isOnline: user.isOnline,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    profileUpdatedAt: user.profileUpdatedAt,
    lastLoginAt: user.lastLoginAt,
    lastSeenAt: user.lastSeenAt,
  };
};

export const updateUser = async (id: string, data: UpdateUserDTO): Promise<UserResponseDTO> => {
  const { password, ...rest } = data;
  const updateData: any = { ...rest }; // eslint-disable-line @typescript-eslint/no-explicit-any

  if (password) {
    updateData.passwordHash = await bcrypt.hash(password, 10);
  }

  const user = await userRepository.update(id, {
    ...updateData,
    profileUpdatedAt: new Date(),
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isOnline: user.isOnline,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    profileUpdatedAt: user.profileUpdatedAt,
    lastLoginAt: user.lastLoginAt,
    lastSeenAt: user.lastSeenAt,
  };
};

export const deleteUser = async (id: string): Promise<void> => {
  await userRepository.delete(id);
};

export const searchUsers = async (query: string): Promise<UserResponseDTO[]> => {
  const users = await userRepository.searchByNameOrEmail(query);
  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    isOnline: user.isOnline,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    profileUpdatedAt: user.profileUpdatedAt,
    lastLoginAt: user.lastLoginAt,
    lastSeenAt: user.lastSeenAt,
  }));
};

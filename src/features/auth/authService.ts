import { UserRepositoryPrisma } from '../../infrastructure/users/UserRepositoryPrisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginResponseDTO, RegisterResponseDTO } from '../../domain/auth/dto';
import { UserResponseDTO } from '../../domain/users/dto';
import { AppError } from '../../infrastructure/errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const userRepository = new UserRepositoryPrisma();

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponseDTO> => {
  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'User not found');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, 'Invalid password');
    }

    const updatedUser = await updateUserStatus(user.id, {
      isOnline: true,
      lastLoginAt: new Date(),
      lastSeenAt: new Date(),
    });

    const token = jwt.sign({ id: updatedUser.id }, JWT_SECRET, { expiresIn: '1h' });

    return {
      token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        isOnline: updatedUser.isOnline,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        lastLoginAt: updatedUser.lastLoginAt,
        lastSeenAt: updatedUser.lastSeenAt,
      },
    };
  } catch (err: any) {
    if (err.name === 'PrismaClientInitializationError') {
      throw new AppError(503, 'Database unavailable');
    }
    throw err;
  }
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<RegisterResponseDTO> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepository.create({
    name,
    email,
    passwordHash: hashedPassword,
  });

  const updatedUser = await userRepository.update(user.id, {
    isOnline: true,
    lastLoginAt: new Date(),
    lastSeenAt: new Date(),
  });

  const token = jwt.sign({ id: updatedUser.id }, JWT_SECRET, { expiresIn: '1h' });

  return {
    token,
    user: {
      id: updatedUser!.id,
      name: updatedUser!.name,
      email: updatedUser!.email,
      isOnline: updatedUser!.isOnline,
      createdAt: updatedUser!.createdAt,
      updatedAt: updatedUser!.updatedAt,
      lastLoginAt: updatedUser!.lastLoginAt,
      lastSeenAt: updatedUser!.lastSeenAt,
    },
  };
};

export const updateUserStatus = async (id: string, status: {
  isOnline?: boolean;
  lastLoginAt?: Date;
  lastSeenAt?: Date;
}): Promise<UserResponseDTO> => {
  const user = await userRepository.update(id, status);

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


export const logoutUser = async (userId: string): Promise<void> => {
  try {
    await updateUserStatus(userId, {
      isOnline: false,
      lastSeenAt: new Date(),
    });
  } catch (err: any) {
    if (err.name === 'PrismaClientInitializationError') {
      throw new AppError(503, 'Database unavailable');
    }
    throw err;
  }
};


export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch (err) {
    throw new AppError(401, 'Invalid token');
  }
};

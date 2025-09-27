import { prisma } from '../../infrastructure/prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { LoginResponseDTO } from '../../domain/auth/dto/LoginResponseDTO';
import { RegisterResponseDTO } from '../../domain/auth/dto/RegisterResponseDTO';
import { AppError } from '../../infrastructure/errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_to_a_strong_secret';

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<RegisterResponseDTO> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
    },
  });

  // Token para login automático
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponseDTO> => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(401, 'User not found');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, 'Invalid password');
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (err: any) {
    if (err.name === 'PrismaClientInitializationError') {
      throw new AppError(503, 'Database unavailable');
    }
    throw err;
  }
}


export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch (err) {
    throw new AppError(401, 'Invalid token');
  }
};

import 'dotenv/config';
import { UserRepositoryPrisma } from '@/infrastructure/users/UserRepositoryPrisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthUserDTO } from '@/domain/auth/dto';
import { UnauthorizedError } from '@/infrastructure/errors/UnauthorizedError';
import { toAuthUserDTO } from '@/domain/auth/mapper/toAuthUserDTO';

const userRepository = new UserRepositoryPrisma();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const ACCESS_EXPIRES = '15m';
const REFRESH_EXPIRES = '7d';

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });

  return { accessToken, refreshToken };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: AuthUserDTO; accessToken: string; refreshToken: string }> => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new UnauthorizedError('User not found');

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) throw new UnauthorizedError('Invalid password');

  const updatedUser = await userRepository.update(user.id, {
    isOnline: true,
    lastLoginAt: new Date(),
    lastSeenAt: new Date(),
  });

  const { accessToken, refreshToken } = generateTokens(updatedUser.id);

  return {
    accessToken,
    refreshToken,
    user: toAuthUserDTO(updatedUser),
  };
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ user: AuthUserDTO; accessToken: string; refreshToken: string }> => {
  const hashed = await bcrypt.hash(password, 10);

  const user = await userRepository.create({
    name,
    email,
    passwordHash: hashed,
  });

  const updated = await userRepository.update(user.id, {
    isOnline: true,
    lastLoginAt: new Date(),
    lastSeenAt: new Date(),
  });

  const { accessToken, refreshToken } = generateTokens(updated.id);

  return {
    user: toAuthUserDTO(updated),
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { id: string };
    const user = await userRepository.findById(decoded.id);
    if (!user) throw new UnauthorizedError('User no longer exists');

    const accessToken = jwt.sign({ id: decoded.id }, JWT_ACCESS_SECRET, {
      expiresIn: ACCESS_EXPIRES,
    });

    return accessToken;
  } catch {
    throw new UnauthorizedError('Invalid refresh token');
  }
};

export const logoutUser = async (userId: string) => {
  await userRepository.update(userId, {
    isOnline: false,
    lastSeenAt: new Date(),
  });
};

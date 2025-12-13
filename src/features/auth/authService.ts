import 'dotenv/config';
import { UserRepositoryPrisma } from '@/infrastructure/users/UserRepositoryPrisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { AuthUserDTO } from '@/domain/auth/dto';
import { UnauthorizedError } from '@/infrastructure/errors/UnauthorizedError';
import { toAuthUserDTO } from '@/domain/auth/mapper/toAuthUserDTO';

const userRepository = new UserRepositoryPrisma();
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL);

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

  if (!user.passwordHash) throw new UnauthorizedError('Invalid password');

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

export const getGoogleAuthURL = () => {
  return googleClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
  });
};

export const loginWithGoogle = async (
  code: string
): Promise<{ user: AuthUserDTO; accessToken: string; refreshToken: string }> => {
  try {
    const { tokens } = await googleClient.getToken(code);
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
      audience: GOOGLE_CLIENT_ID!,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new UnauthorizedError('Invalid Google token');
    }

    const { email, name, sub: googleId } = payload;

    let user = await userRepository.findByEmail(email);

    if (!user) {
      user = await userRepository.create({
        name: name || 'Google User',
        email,
        googleId,
      });
    }

    // Link googleId if not present
    if (user && !user.googleId) {
      user = await userRepository.update(user.id, {
        googleId: googleId,
      });
    }

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
  } catch (error) {
    console.error('Google Auth Error:', error);
    throw new UnauthorizedError('Google authentication failed');
  }
};

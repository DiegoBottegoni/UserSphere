import { AuthUserDTO } from '../dto';
import { User } from '@prisma/client';

export const toAuthUserDTO = (user: User): AuthUserDTO => ({
  id: user.id,
  name: user.name,
  email: user.email,
  isOnline: user.isOnline,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  lastLoginAt: user.lastLoginAt,
  lastSeenAt: user.lastSeenAt,
});

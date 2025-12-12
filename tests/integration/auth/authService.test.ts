import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from '@/features/auth/authService';
import { prisma } from '@/infrastructure/prisma/client';
import { UnauthorizedError } from '@/infrastructure/errors/UnauthorizedError';
import jwt from 'jsonwebtoken';

describe('AuthService Integration Tests', () => {
  const testEmail = `auth-test-${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let createdUserId: string;

  // Since global setup resets DB before each test, we need to create data per test or in beforeEach
  // However, for the register test we want a clean slate.
  
  describe('registerUser', () => {
    it('should register a new user and return tokens', async () => {
      const email = `reg-${Date.now()}@test.com`;
      const { user, accessToken, refreshToken } = await registerUser(
        'Auth Tester',
        email,
        testPassword
      );

      expect(user).toHaveProperty('id');
      expect(user.email).toBe(email);
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();

      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      expect(dbUser).toBeDefined();
    });

    it('should fail if email already exists', async () => {
      const email = `dup-${Date.now()}@test.com`;
      // Create first user
      await registerUser('User 1', email, testPassword);
      
      // Try duplicate
      await expect(
        registerUser('User 2', email, testPassword)
      ).rejects.toThrow(); 
    });
  });

  describe('loginUser', () => {
    beforeEach(async () => {
       const user = await prisma.user.create({
         data: {
           name: 'Login User',
           email: testEmail,
           passwordHash: await import('bcryptjs').then(b => b.hash(testPassword, 10))
         }
       });
       createdUserId = user.id;
    });

    it('should login successfully with correct credentials', async () => {
      const { user, accessToken, refreshToken } = await loginUser(
        testEmail,
        testPassword
      );

      expect(user.id).toBe(createdUserId);
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });

    it('should throw UnauthorizedError for non-existent user', async () => {
      await expect(
        loginUser('nonexistent@example.com', 'password')
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for incorrect password', async () => {
      await expect(
        loginUser(testEmail, 'wrong-password')
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('refreshAccessToken', () => {
    beforeEach(async () => {
       const user = await prisma.user.create({
         data: {
           name: 'Refresh User',
           email: testEmail,
           passwordHash: 'hash'
         }
       });
       createdUserId = user.id;
    });

    it('should issue a new access token with valid refresh token', async () => {
      // Manually generate a valid refresh token for this user
      const validRefreshToken = jwt.sign({ id: createdUserId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
      
      const newAccessToken = await refreshAccessToken(validRefreshToken);

      expect(newAccessToken).toBeDefined();
      const decoded = jwt.decode(newAccessToken) as any;
      expect(decoded.id).toBe(createdUserId);
    });
  });

  describe('logoutUser', () => {
     beforeEach(async () => {
       const user = await prisma.user.create({
         data: {
           name: 'Logout User',
           email: testEmail,
           passwordHash: 'hash',
           isOnline: true
         }
       });
       createdUserId = user.id;
    });

    it('should set user to offline', async () => {
      await logoutUser(createdUserId);

      const dbUser = await prisma.user.findUnique({ where: { id: createdUserId } });
      expect(dbUser?.isOnline).toBe(false);
    });
  });
});

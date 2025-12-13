import { prisma } from '@/infrastructure/prisma/client';
import { UnauthorizedError } from '@/infrastructure/errors/UnauthorizedError';

// Mock setup must be before imports that use it if we want to capture top-level instantiation
const mockGetToken = jest.fn();
const mockVerifyIdToken = jest.fn();
const mockGenerateAuthUrl = jest.fn();

jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => {
      return {
        getToken: mockGetToken,
        verifyIdToken: mockVerifyIdToken,
        generateAuthUrl: mockGenerateAuthUrl,
      };
    }),
  };
});

// Import service AFTER mock
import { loginWithGoogle } from '@/features/auth/authService';

describe('Google Auth Integration Tests', () => {
  const testEmail = `google-test-${Date.now()}@example.com`;
  const googleId = `google-id-${Date.now()}`;
  const mockToken = 'mock-google-id-token';
  const mockCode = 'mock-auth-code';

  beforeEach(async () => {
    // Clear mocks
    jest.clearAllMocks();

    // Default mock behavior
    mockGetToken.mockResolvedValue({
      tokens: { id_token: mockToken },
    });
    mockVerifyIdToken.mockResolvedValue({
      getPayload: jest.fn().mockReturnValue({
        email: testEmail,
        name: 'Google User',
        sub: googleId,
      }),
    });
    mockGenerateAuthUrl.mockReturnValue('https://accounts.google.com/o/oauth2/v2/auth');
  });

  afterAll(async () => {
    // Cleanup
    const deleteUsers = prisma.user.deleteMany({
      where: {
        email: { contains: 'google-test' }
      }
    });
    await prisma.$transaction([deleteUsers]);
    await prisma.$disconnect();
  });

  it('should register a new user via Google login', async () => {
    const { user, accessToken, refreshToken } = await loginWithGoogle(mockCode);

    expect(user).toBeDefined();
    expect(user.email).toBe(testEmail);
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();

    const dbUser = await prisma.user.findUnique({ where: { email: testEmail } });
    expect(dbUser).toBeDefined();
    expect(dbUser?.googleId).toBe(googleId);
  });

  it('should login existing user via Google and link account', async () => {
    // Create user without googleId first
    const existingEmail = `link-test-${Date.now()}@example.com`;
    await prisma.user.create({
      data: {
        name: 'Existing User',
        email: existingEmail,
        passwordHash: 'somehash',
      }
    });

    // Mock payload for this specific test
    mockVerifyIdToken.mockResolvedValueOnce({
      getPayload: jest.fn().mockReturnValue({
            email: existingEmail,
            name: 'Existing User',
            sub: 'new-google-id',
        }),
    });

    const { user } = await loginWithGoogle(mockCode);

    expect(user.email).toBe(existingEmail);
    
    const dbUser = await prisma.user.findUnique({ where: { email: existingEmail } });
    expect(dbUser?.googleId).toBe('new-google-id');
  });

  it('should throw UnauthorizedError if Google token is invalid', async () => {
     mockVerifyIdToken.mockResolvedValueOnce({
        getPayload: jest.fn().mockReturnValue(null), // simulate invalid token
     });

    await expect(loginWithGoogle(mockCode)).rejects.toThrow(UnauthorizedError);
  });
});

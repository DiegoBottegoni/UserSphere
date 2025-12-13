export interface AuthUserDTO {
  id: string;
  name: string;
  email: string;
  googleId: string;
  isOnline: boolean;
  lastLoginAt: Date | null;
  lastSeenAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  profileUpdatedAt: Date | null;
}

export interface LoginResponseDTO {
  user: AuthUserDTO;
}

export interface RegisterResponseDTO {
  user: AuthUserDTO;
}

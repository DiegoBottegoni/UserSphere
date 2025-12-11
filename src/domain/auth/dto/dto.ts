export interface AuthUserDTO {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  lastSeenAt: Date | null;
}

export interface LoginResponseDTO {
  user: AuthUserDTO;
}

export interface RegisterResponseDTO {
  user: AuthUserDTO;
}

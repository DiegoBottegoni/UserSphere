export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileUpdatedAt: Date | null;
  lastLoginAt: Date | null;
  lastSeenAt: Date | null;
}

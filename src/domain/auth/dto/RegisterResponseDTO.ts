export interface RegisterResponseDTO {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    isOnline: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date | null;
    lastSeenAt: Date | null;
  };
}

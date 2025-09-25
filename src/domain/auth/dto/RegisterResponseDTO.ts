export interface RegisterResponseDTO {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

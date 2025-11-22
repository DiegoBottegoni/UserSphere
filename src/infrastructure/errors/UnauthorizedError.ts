import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  constructor(
    message = 'Unauthorized. Please authenticate to access this resource.',
    isOperational = true
  ) {
    super(401, message, isOperational);
  }
}

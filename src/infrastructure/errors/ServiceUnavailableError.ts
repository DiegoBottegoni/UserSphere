import { AppError } from './AppError';

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service unavailable. Please try again later.', isOperational = true) {
    super(503, message, isOperational);
  }
}

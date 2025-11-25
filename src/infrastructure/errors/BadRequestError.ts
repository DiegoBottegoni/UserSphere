import { AppError } from './AppError';

export class BadRequestError extends AppError {
  constructor(
    message = 'Bad request. Please check your input and try again.',
    isOperational = true
  ) {
    super(400, message, isOperational);
  }
}

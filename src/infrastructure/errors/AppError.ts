export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // 🔑 Línea clave para que instanceof funcione correctamente
    Object.setPrototypeOf(this, new.target.prototype);

    // 🔎 Guarda un stack trace limpio (sin incluir el constructor)
    Error.captureStackTrace(this);
  }
}

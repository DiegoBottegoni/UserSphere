import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/AppError';

/**
 * Global error handler for the application
 * Catches Prisma errors, Auth errors, Validation errors, etc.
 */
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('🔥 Error caught by middleware:', err);

  // ---------- Prisma Known Request Errors ----------
  if (err.code) {
    switch (err.code) {
      case 'P1000':
        return res.status(500).json({
          error: 'Authentication failed against the database server.',
        });
      case 'P1001':
        return res.status(503).json({
          error: 'Database unavailable. Please try again later.',
        });
      case 'P1002':
        return res.status(503).json({
          error: 'Database operation timed out.',
        });
      case 'P2000':
        return res.status(400).json({
          error: 'Invalid value provided for a field (too long).',
        });
      case 'P2002':
        return res.status(409).json({
          error: 'Conflict: A record with this field already exists.',
          target: err.meta?.target,
        });
      case 'P2003':
        return res.status(400).json({
          error: 'Foreign key constraint failed.',
          field: err.meta?.field_name,
        });
      case 'P2004':
        return res.status(400).json({
          error: 'Constraint violation detected.',
        });
      case 'P2005':
        return res.status(400).json({
          error: 'Invalid value stored in the database for this field.',
        });
      case 'P2006':
        return res.status(400).json({
          error: 'The provided value for a field is not valid.',
        });
      case 'P2007':
        return res.status(400).json({
          error: 'Data validation error.',
        });
      case 'P2010':
        return res.status(400).json({
          error: 'Raw query failed. Check your query and parameters.',
        });
      case 'P2011':
        return res.status(400).json({
          error: 'Null constraint violation.',
          target: err.meta?.target,
        });
      case 'P2012':
        return res.status(400).json({
          error: 'Missing required field.',
          path: err.meta?.path,
        });
      case 'P2014':
        return res.status(400).json({
          error:
            'The change you are trying to make would violate a relation constraint.',
        });
      case 'P2016':
        return res.status(400).json({
          error: 'Query interpretation error. Invalid value provided.',
        });
      case 'P2017':
        return res.status(400).json({
          error: 'Records for relation not connected.',
        });
      case 'P2021':
        return res.status(500).json({
          error: 'Table not found in the database.',
        });
      case 'P2022':
        return res.status(500).json({
          error: 'Column not found in the database.',
        });
      case 'P2025':
        return res.status(404).json({
          error: 'Record not found.',
        });
    }
  }

  // ---------- AppError personalizado ----------
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // ---------- JWT ----------
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // ---------- Validation errors ----------
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.details || err.message,
    });
  }

  // ---------- Fallback genérico ----------
  return res.status(500).json({
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

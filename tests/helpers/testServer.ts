import request from 'supertest';
import app from '@/app';
import { prisma } from '@/infrastructure/prisma/client';

// Limpia TODAS las tablas antes de cada test
export const resetDatabase = async () => {
  const modelNames = Object.keys(prisma).filter(key => {
    // identifica modelos Prisma válidos
    return typeof prisma[key]?.deleteMany === 'function';
  });

  for (const model of modelNames) {
    try {
      await prisma[model].deleteMany();
    } catch (err) {}
  }
};

// cliente supertest envuelto
export const testServer = () => {
  return request(app);
};

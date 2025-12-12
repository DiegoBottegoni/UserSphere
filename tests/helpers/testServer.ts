import request from 'supertest';
import { createApp } from '@/app';
import { prisma } from '@/infrastructure/prisma/client';

// Initialize app once for tests
const app = createApp();

// Limpia TODAS las tablas antes de cada test
export const resetDatabase = async () => {
  const prismaClient = prisma as any;
  const modelNames = Object.keys(prismaClient).filter(key => {
    // identifica modelos Prisma válidos
    return typeof prismaClient[key]?.deleteMany === 'function';
  });

  for (const model of modelNames) {
    try {
      await prismaClient[model].deleteMany();
    } catch (err) {}
  }
};

// cliente supertest envuelto
export const testServer = () => {
  return request(app);
};

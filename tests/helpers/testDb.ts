// tests/helpers/testDb.ts
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

/**
 * Retorna una instancia única de Prisma para los tests.
 */
export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

/**
 * Limpia TODAS las tablas de la base de datos.
 * Esto corre antes de cada test.
 */
export async function resetTestDB() {
  const db = getPrisma();

  // OJO: Esto borra todas las tablas.
  // Prisma genera las tablas según tu schema.prisma.
  const tablenames = await db.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tablenames) {
    // No queremos borrar la tabla _prisma_migrations
    if (tablename !== '_prisma_migrations') {
      await db.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`);
    }
  }
}

/**
 * Cierra conexión cuando terminan todos los tests.
 */
export async function disconnectDB() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
}

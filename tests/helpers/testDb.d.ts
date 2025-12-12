import { PrismaClient } from '@prisma/client';
/**
 * Retorna una instancia única de Prisma para los tests.
 */
export declare function getPrisma(): PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
/**
 * Limpia TODAS las tablas de la base de datos.
 * Esto corre antes de cada test.
 */
export declare function resetTestDB(): Promise<void>;
/**
 * Cierra conexión cuando terminan todos los tests.
 */
export declare function disconnectDB(): Promise<void>;
//# sourceMappingURL=testDb.d.ts.map
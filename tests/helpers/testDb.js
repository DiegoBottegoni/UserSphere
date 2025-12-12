"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrisma = getPrisma;
exports.resetTestDB = resetTestDB;
exports.disconnectDB = disconnectDB;
// tests/helpers/testDb.ts
const client_1 = require("@prisma/client");
let prisma = null;
/**
 * Retorna una instancia única de Prisma para los tests.
 */
function getPrisma() {
    if (!prisma) {
        prisma = new client_1.PrismaClient();
    }
    return prisma;
}
/**
 * Limpia TODAS las tablas de la base de datos.
 * Esto corre antes de cada test.
 */
async function resetTestDB() {
    const db = getPrisma();
    // OJO: Esto borra todas las tablas.
    // Prisma genera las tablas según tu schema.prisma.
    const tablenames = await db.$queryRaw `SELECT tablename FROM pg_tables WHERE schemaname='public'`;
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
async function disconnectDB() {
    if (prisma) {
        await prisma.$disconnect();
        prisma = null;
    }
}
//# sourceMappingURL=testDb.js.map
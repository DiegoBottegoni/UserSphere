"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testServer = exports.resetDatabase = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("@/app"));
const client_1 = require("@/infrastructure/prisma/client");
// Limpia TODAS las tablas antes de cada test
const resetDatabase = async () => {
    const modelNames = Object.keys(client_1.prisma).filter(key => {
        // identifica modelos Prisma válidos
        return typeof client_1.prisma[key]?.deleteMany === 'function';
    });
    for (const model of modelNames) {
        try {
            await client_1.prisma[model].deleteMany();
        }
        catch (err) { }
    }
};
exports.resetDatabase = resetDatabase;
// cliente supertest envuelto
const testServer = () => {
    return (0, supertest_1.default)(app_1.default);
};
exports.testServer = testServer;
//# sourceMappingURL=testServer.js.map
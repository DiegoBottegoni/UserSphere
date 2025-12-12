"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const envPath = path_1.default.resolve(process.cwd(), 'prisma/.env.test');
console.log('Loading test env from:', envPath);
(0, dotenv_1.config)({ path: envPath });
console.log('Loaded test environment DATABASE_URL:', process.env.DATABASE_URL);
//# sourceMappingURL=setupEnv.js.map
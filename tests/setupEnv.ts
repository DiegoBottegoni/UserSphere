import { config } from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), 'prisma/.env.test');

console.log('Loading test env from:', envPath);

config({ path: envPath });

console.log('Loaded test environment DATABASE_URL:', process.env.DATABASE_URL);

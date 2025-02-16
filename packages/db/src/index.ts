import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

config({ path: '.env' });

const client = postgres(process.env.POSTGRES_URL as string);

// biome-ignore lint/performance/noBarrelFile: <explanation>
// biome-ignore lint/performance/noReExportAll: <explanation>
export * from './schema';
export const db = drizzle({ client });

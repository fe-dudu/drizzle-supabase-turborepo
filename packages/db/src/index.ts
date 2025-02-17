import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const client = postgres(process.env.POSTGRES_URL as string);

// biome-ignore lint/performance/noBarrelFile: <explanation>
export { postTable } from './schema/post';
export { tenantTable } from './schema/tenant';
export { userRole, userTable } from './schema/user';
export { lower } from './utils/lower';
export const db = drizzle({ client });

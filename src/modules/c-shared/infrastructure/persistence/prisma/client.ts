import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = new PrismaClient();

console.log('[prisma/client] DATABASE_URL:', process.env.DATABASE_URL ?? '(undefined)');

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}
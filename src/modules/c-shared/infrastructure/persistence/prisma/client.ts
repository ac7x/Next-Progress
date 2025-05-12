import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// 使用單例模式，確保不重複創建 PrismaClient 實例
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// 開發環境下將實例存儲在 global 對象上，避免熱重載時創建多個實例
if (process.env.NODE_ENV === 'development') {
  if (!global.prisma) {
    console.log('[prisma/client] Creating new PrismaClient instance');
    global.prisma = prisma;
  } else {
    console.log('[prisma/client] Reusing existing PrismaClient instance');
  }
}

// 只在初始化時打印一次連接信息
console.log('[prisma/client] DATABASE_URL:', process.env.DATABASE_URL ? '(configured)' : '(undefined)');
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { PrismaClient } from '@prisma/client';

/**
 * 事務管理介面 - 定義事務操作
 */
export interface ITransactionManager {
    /**
     * 在事務中執行操作
     * @param operation 要在事務中執行的操作
     */
    runInTransaction<T>(operation: (tx: PrismaClient) => Promise<T>): Promise<T>;
}

/**
 * Prisma 事務管理服務 - 實現基於 Prisma 的事務操作
 */
export class PrismaTransactionManager implements ITransactionManager {
    /**
     * 在 Prisma 事務中執行操作
     * @param operation 要在事務中執行的操作函數
     * @returns 操作結果
     */
    async runInTransaction<T>(operation: (tx: PrismaClient) => Promise<T>): Promise<T> {
        return await prisma.$transaction(async (tx) => {
            return await operation(tx as unknown as PrismaClient);
        });
    }
}

// 導出單例實例
export const transactionManager = new PrismaTransactionManager();

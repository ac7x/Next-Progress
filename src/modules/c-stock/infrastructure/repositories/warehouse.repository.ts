import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { CreateWarehouseProps, UpdateWarehouseProps, Warehouse } from '../../domain/entities/warehouse.entity';
import { IWarehouseRepository } from '../../domain/repositories/warehouse.repository.interface';
import { transactionManager } from '../persistence/transaction.manager';

/**
 * 倉庫儲存庫 - 實現倉庫實體在Prisma/MongoDB的持久化操作
 */
export class WarehouseInstanceRepository implements IWarehouseRepository {
  /**
   * 根據ID查找倉庫
   * @param id 倉庫ID
   */
  async findById(id: string): Promise<Warehouse | null> {
    const warehouse = await prisma.warehouseInstance.findUnique({
      where: { id }
    });

    return warehouse;
  }

  /**
   * 查詢所有倉庫
   * @param options 分頁和排序選項
   */
  async findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: { [key: string]: 'asc' | 'desc' }
  }): Promise<Warehouse[]> {
    const warehouses = await prisma.warehouseInstance.findMany({
      skip: options?.skip,
      take: options?.take,
      orderBy: options?.orderBy
    });

    return warehouses;
  }

  /**
   * 根據名稱查詢倉庫
   * @param name 倉庫名稱
   */
  async findByName(name: string): Promise<Warehouse | null> {
    const warehouse = await prisma.warehouseInstance.findFirst({
      where: { name }
    });

    return warehouse;
  }

  /**
   * 創建新倉庫
   * @param data 倉庫創建資料
   */
  async create(data: CreateWarehouseProps): Promise<Warehouse> {
    const warehouse = await prisma.warehouseInstance.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        location: data.location ?? null,
        isActive: data.isActive ?? true
      }
    });

    return warehouse;
  }

  /**
   * 更新倉庫資訊
   * @param id 倉庫ID
   * @param data 更新資料
   */
  async update(id: string, data: UpdateWarehouseProps): Promise<Warehouse> {
    const warehouse = await prisma.warehouseInstance.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.isActive !== undefined && { isActive: data.isActive })
      }
    });

    return warehouse;
  }

  /**
   * 刪除倉庫
   * @param id 倉庫ID
   */
  async delete(id: string): Promise<boolean> {
    try {
      // 使用事務確保刪除操作的一致性
      return await transactionManager.runInTransaction(async (tx) => {
        // 先刪除所有關聯的標籤關係
        await tx.tagRelation.deleteMany({
          where: {
            targetId: id,
            targetType: 'WAREHOUSE_INSTANCE'
          }
        });

        // 刪除倉庫
        await tx.warehouseInstance.delete({
          where: { id }
        });

        return true;
      });
    } catch (error) {
      console.error('刪除倉庫失敗:', error);
      return false;
    }
  }

  /**
   * 獲取倉庫總數
   */
  async count(filter?: { isActive?: boolean }): Promise<number> {
    const count = await prisma.warehouseInstance.count({
      where: filter
    });

    return count;
  }
}

import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { CreateWarehouseItemProps, UpdateWarehouseItemProps, WarehouseItem } from '@/modules/c-stock/domain/warehouse-item-entity';
import { IWarehouseItemDomainService, WarehouseItemDomainService } from '@/modules/c-stock/domain/warehouse-item-service';
import { warehouseItemRepository } from '@/modules/c-stock/infrastructure/warehouse-item-repository';

export class WarehouseItemApplicationService {
  constructor(private readonly domainService: IWarehouseItemDomainService) { }

  async getAllWarehouseItems(): Promise<WarehouseItem[]> {
    return this.domainService.getAllWarehouseItems();
  }

  async getWarehouseItemsByWarehouse(warehouseId: string): Promise<WarehouseItem[]> {
    return this.domainService.getWarehouseItemsByWarehouse(warehouseId);
  }

  async getWarehouseItemById(id: string): Promise<WarehouseItem | null> {
    return this.domainService.getWarehouseItemById(id);
  }

  async getWarehouseItemTags(warehouseItemId: string): Promise<string[]> {
    const tagRelations = await prisma.tagRelation.findMany({
      where: { targetId: warehouseItemId, targetType: 'ITEM' },
      select: { tagId: true }
    });
    return tagRelations.map(relation => relation.tagId);
  }

  async createWarehouseItem(data: CreateWarehouseItemProps): Promise<WarehouseItem> {
    return this.domainService.createWarehouseItem(data);
  }

  async updateWarehouseItem(id: string, data: UpdateWarehouseItemProps): Promise<WarehouseItem> {
    return this.domainService.updateWarehouseItem(id, data);
  }

  async deleteWarehouseItem(id: string): Promise<void> {
    return this.domainService.deleteWarehouseItem(id);
  }

  async addTagToItem(itemId: string, tagId: string): Promise<void> {
    await prisma.tagRelation.create({
      data: { tagId, targetId: itemId, targetType: 'ITEM' }
    });
  }

  async removeTagFromItem(itemId: string, tagId: string): Promise<void> {
    await prisma.tagRelation.deleteMany({
      where: { targetId: itemId, tagId, targetType: 'ITEM' }
    });
  }
}

// 注入依賴
const domainService = new WarehouseItemDomainService(warehouseItemRepository);
export const warehouseItemService = new WarehouseItemApplicationService(domainService);

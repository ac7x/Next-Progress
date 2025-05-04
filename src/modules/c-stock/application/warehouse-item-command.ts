import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { CreateWarehouseItemProps, UpdateWarehouseItemProps } from '@/modules/c-stock/domain/warehouse-item-entity';
import { IWarehouseItemDomainService, WarehouseItemDomainService } from '@/modules/c-stock/domain/warehouse-item-service';
import { warehouseItemRepository } from '@/modules/c-stock/infrastructure/warehouse-item-repository';
import { TagRelationType } from '@/modules/c-tag/domain/tag-entity';

const domainService: IWarehouseItemDomainService = new WarehouseItemDomainService(warehouseItemRepository);

export async function commandCreateWarehouseItem(data: CreateWarehouseItemProps) {
    return domainService.createWarehouseItem(data);
}

export async function commandUpdateWarehouseItem(id: string, data: UpdateWarehouseItemProps) {
    return domainService.updateWarehouseItem(id, data);
}

export async function commandDeleteWarehouseItem(id: string) {
    return domainService.deleteWarehouseItem(id);
}

export async function commandAddTagToItem(itemId: string, tagId: string) {
    await prisma.tagRelation.create({
        data: { tagId, targetId: itemId, targetType: TagRelationType.WAREHOUSE_ITEM },
    });
}

export async function commandRemoveTagFromItem(itemId: string, tagId: string) {
    await prisma.tagRelation.deleteMany({
        where: { targetId: itemId, tagId, targetType: TagRelationType.WAREHOUSE_ITEM },
    });
}

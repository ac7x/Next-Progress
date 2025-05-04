import { createWarehouseItem, deleteWarehouseItem } from '@/modules/c-stock/application/warehouse-item-actions';
import { CreateWarehouseItemProps } from '@/modules/c-stock/domain/warehouse-item-entity';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateWarehouseItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['warehouseItem', 'create'],
    mutationFn: (data: CreateWarehouseItemProps) => createWarehouseItem(data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['warehouseItems', vars.warehouseId] });
    }
  });
}

export function useDeleteWarehouseItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ['warehouseItem', 'delete'],
    mutationFn: (id: string) => deleteWarehouseItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['warehouseItems'] });
    }
  });
}

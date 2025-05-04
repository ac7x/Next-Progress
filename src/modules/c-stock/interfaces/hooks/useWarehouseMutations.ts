import { createWarehouseInstance, deleteWarehouseInstance } from '@/modules/c-stock/application/warehouse-actions';
import { CreateWarehouseInstanceProps, WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateWarehouse() {
  const qc = useQueryClient();
  return useMutation<WarehouseInstance, Error, CreateWarehouseInstanceProps>({
    mutationKey: ['warehouseInstance', 'create'],
    mutationFn: createWarehouseInstance,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouseInstances'] })
  });
}

export function useDeleteWarehouse() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationKey: ['warehouseInstance', 'delete'],
    mutationFn: deleteWarehouseInstance,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouseInstances'] })
  });
}

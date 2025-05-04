import { createWarehouseInstance, deleteWarehouseInstance } from '@/modules/c-stock/application/warehouse.command';
import { CreateWarehouseInstanceProps, WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateWarehouseInstance() {
  const qc = useQueryClient();
  return useMutation<WarehouseInstance, Error, CreateWarehouseInstanceProps>({
    mutationKey: ['warehouseInstance', 'createInstance'],
    mutationFn: createWarehouseInstance,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouseInstances'] })
  });
}

export function useDeleteWarehouseInstance() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationKey: ['warehouseInstance', 'deleteInstance'],
    mutationFn: deleteWarehouseInstance,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouseInstances'] })
  });
}

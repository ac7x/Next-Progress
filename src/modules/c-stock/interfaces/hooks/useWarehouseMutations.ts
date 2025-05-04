import { createWarehouseInstance, deleteWarehouseInstance } from '@/modules/c-stock/application/warehouse.command';
import { CreateWarehouseInstanceProps, WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { useMutation } from '@tanstack/react-query';

export function useCreateWarehouseInstance() {
  return useMutation<WarehouseInstance, Error, CreateWarehouseInstanceProps>({
    mutationKey: ['warehouseInstance', 'createInstance'],
    mutationFn: createWarehouseInstance
  });
}

export function useDeleteWarehouseInstance() {
  return useMutation<void, Error, string>({
    mutationKey: ['warehouseInstance', 'deleteInstance'],
    mutationFn: deleteWarehouseInstance
  });
}

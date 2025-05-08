import { createWarehouseInstance, deleteWarehouseInstance } from '@/modules/c-stock/application/warehouse.command';
import { CreateWarehouseInstanceProps, WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { useMutation } from '@tanstack/react-query';

// Command Hook Only (SRP: 只負責寫入)
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

import { createWarehouse, deleteWarehouse } from '@/modules/c-stock/application/warehouse-actions';
import { CreateWarehouseProps, Warehouse } from '@/modules/c-stock/domain/warehouse-entity';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateWarehouse() {
  const qc = useQueryClient();
  return useMutation<Warehouse | null, Error, CreateWarehouseProps>({
    mutationKey: ['warehouse', 'create'],
    mutationFn: createWarehouse,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouses'] })
  });
}

export function useDeleteWarehouse() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationKey: ['warehouse', 'delete'],
    mutationFn: deleteWarehouse,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['warehouses'] })
  });
}

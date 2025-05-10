'use client';

import {
  createWarehouse,
  deleteWarehouse,
  updateWarehouse
} from '@/modules/c-stock/application/commands';
import { CreateWarehouseDTO, UpdateWarehouseDTO } from '@/modules/c-stock/application/dto';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * 倉庫變更操作 Hook
 */
export function useWarehouseMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateWarehouseDTO) => createWarehouse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouseInstances'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWarehouseDTO }) =>
      updateWarehouse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouseInstances'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWarehouse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouseInstances'] });
    },
  });

  return {
    createWarehouse: createMutation,
    updateWarehouse: updateMutation,
    deleteWarehouse: deleteMutation,
  };
}

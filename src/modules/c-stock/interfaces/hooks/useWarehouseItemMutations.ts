'use client';

import {
  createManyWarehouseItems,
  createWarehouseItem,
  deleteWarehouseItem,
  updateWarehouseItem,
  updateWarehouseItemQuantity,
} from '@/modules/c-stock/application/commands'; // 修正匯入路徑
import { CreateWarehouseItemDTO, UpdateWarehouseItemDTO } from '@/modules/c-stock/application/dto'; // 修正匯入路徑
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * 倉庫物品變更操作 Hook
 */
export function useWarehouseItemMutations(warehouseId?: string) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateWarehouseItemDTO) => createWarehouseItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouseItems', warehouseId] });
      queryClient.invalidateQueries({ queryKey: ['warehouseInstances'] });
    },
  });

  const createManyMutation = useMutation({
    mutationFn: ({
      items,
      warehouseId: targetWarehouseId,
    }: {
      items: Omit<CreateWarehouseItemDTO, 'warehouseId'>[];
      warehouseId: string;
    }) => createManyWarehouseItems(items, targetWarehouseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouseItems', warehouseId] });
      queryClient.invalidateQueries({ queryKey: ['warehouseInstances'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWarehouseItemDTO }) =>
      updateWarehouseItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouseItems', warehouseId] });
      queryClient.invalidateQueries({ queryKey: ['warehouseInstances'] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      updateWarehouseItemQuantity(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouseItems', warehouseId] });
      queryClient.invalidateQueries({ queryKey: ['warehouseInstances'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWarehouseItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouseItems', warehouseId] });
      queryClient.invalidateQueries({ queryKey: ['warehouseInstances'] });
    },
  });

  return {
    createWarehouseItem: createMutation,
    createManyWarehouseItems: createManyMutation,
    updateWarehouseItem: updateMutation,
    updateWarehouseItemQuantity: updateQuantityMutation,
    deleteWarehouseItem: deleteMutation,
  };
}

'use client';

import { getItemsByWarehouseId, searchWarehouseItems } from '@/modules/c-stock/application/queries';
import { useQuery } from '@tanstack/react-query';

/**
 * 獲取特定倉庫的物品 Hook
 * @param warehouseId 倉庫ID
 */
export function useWarehouseItems(warehouseId: string) {
  return useQuery({
    queryKey: ['warehouseItems', warehouseId],
    queryFn: () => getItemsByWarehouseId(warehouseId),
    enabled: !!warehouseId,
  });
}

/**
 * 搜索倉庫物品 Hook
 * @param query 搜索關鍵詞
 * @param options 搜索選項
 */
export function useSearchWarehouseItems(
  query: string,
  options?: {
    warehouseId?: string;
    skip?: number;
    take?: number;
  }
) {
  return useQuery({
    queryKey: ['searchWarehouseItems', query, options],
    queryFn: () => searchWarehouseItems(query, options),
    enabled: query.length > 0,
  });
}

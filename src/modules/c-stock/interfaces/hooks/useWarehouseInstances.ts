'use client';

import { getAllWarehouses } from '@/modules/c-stock/application/queries/warehouse-queries';
import { useQuery } from '@tanstack/react-query';

// Query Hook Only (SRP: 只查詢)
export function useWarehouseInstances() {
  return useQuery({
    queryKey: ['warehouseInstances'],
    queryFn: () => getAllWarehouses(),
  });
}

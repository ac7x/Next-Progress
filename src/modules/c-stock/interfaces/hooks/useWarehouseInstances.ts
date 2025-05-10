import { getAllWarehouseInstances } from '@/modules/c-stock/application/warehouse-query';
import { WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { useQuery } from '@tanstack/react-query';

// Query Hook Only (SRP: 只查詢)
export function useWarehouseInstances() {
  return useQuery<WarehouseInstance[], Error>({
    queryKey: ['warehouseInstances'],
    queryFn: getAllWarehouseInstances
  });
}

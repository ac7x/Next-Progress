import { getAllWarehouseInstances } from '@/modules/c-stock/application/warehouse-actions';
import { WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { useQuery } from '@tanstack/react-query';

export function useWarehouseInstances() {
  return useQuery<WarehouseInstance[], Error>({
    queryKey: ['warehouseInstances'],
    queryFn: getAllWarehouseInstances
  });
}

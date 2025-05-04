import { getAllWarehouses } from '@/modules/c-stock/application/warehouse-actions';
import { WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { useQuery } from '@tanstack/react-query';

export function useWarehouses() {
  return useQuery<WarehouseInstance[], Error>({
    queryKey: ['warehouses'],
    queryFn: getAllWarehouses
  });
}

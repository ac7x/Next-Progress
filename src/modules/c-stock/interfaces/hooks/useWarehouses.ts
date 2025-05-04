import { getAllWarehouses } from '@/modules/c-stock/application/warehouse-actions';
import { Warehouse } from '@/modules/c-stock/domain/warehouse-entity';
import { useQuery } from '@tanstack/react-query';

export function useWarehouses() {
  return useQuery<Warehouse[], Error>({
    queryKey: ['warehouses'],
    queryFn: getAllWarehouses
  });
}

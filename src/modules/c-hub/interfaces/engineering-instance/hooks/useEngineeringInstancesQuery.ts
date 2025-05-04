import { listEngineeringsQuery } from '@/modules/c-hub/application/engineering-instance/engineering-instance.query';
import { useQuery } from '@tanstack/react-query';

export function useEngineeringInstancesQuery() {
    return useQuery({
        queryKey: ['engineerings'],
        queryFn: listEngineeringsQuery,
    });
}

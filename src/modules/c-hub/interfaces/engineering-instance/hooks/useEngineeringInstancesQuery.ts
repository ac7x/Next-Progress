import { listEngineeringsQuery } from '@/modules/c-hub/application/engineering-instance/engineering-instance-query';
import { useQuery } from '@tanstack/react-query';

// 查詢工程列表 hook
export function useEngineeringInstancesQuery() {
    return useQuery({
        queryKey: ['engineerings'],
        queryFn: listEngineeringsQuery,
    });
}

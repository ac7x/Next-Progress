// 已被 use-engineering-templates-query.ts 取代，請勿再使用。
import { listEngineeringTemplates } from '@/modules/c-hub/application/engineering-template/engineering-template.usecase';
import { useQuery } from '@tanstack/react-query';

// 工程模板查詢 hook，專責資料取得與快取
export function useEngineeringTemplatesQuery() {
    return useQuery({
        queryKey: ['engineeringTemplates'],
        queryFn: listEngineeringTemplates,
    });
}
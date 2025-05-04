import { useQuery } from '@tanstack/react-query';
import { getEngineeringTemplateListHandler } from '../server-actions/get-engineering-template-list-handler';

// 工程模板查詢 hook，專責資料取得與快取
export function useEngineeringTemplatesQuery() {
  return useQuery({
    queryKey: ['engineeringTemplates'],
    queryFn: getEngineeringTemplateListHandler,
  });
}

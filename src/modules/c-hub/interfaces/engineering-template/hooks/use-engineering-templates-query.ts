import { useQuery } from '@tanstack/react-query';
import { getEngineeringTemplateListHandler } from '../server-actions/get-engineering-template-list-handler';

// 工程模板查詢 hook，專責資料取得與快取
// Query hook，僅查詢，不做資料變更
export function useEngineeringTemplatesQuery() {
  return useQuery({
    queryKey: ['engineeringTemplates'],
    queryFn: getEngineeringTemplateListHandler,
  });
}

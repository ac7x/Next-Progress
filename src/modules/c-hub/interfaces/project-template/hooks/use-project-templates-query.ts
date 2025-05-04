import { listProjectTemplates } from '@/modules/c-hub/application/project-template/project-template-actions';
import { useQuery } from '@tanstack/react-query';

// 專案模板查詢 hook，僅負責資料取得與快取
export function useProjectTemplatesQuery() {
  return useQuery({
    queryKey: ['projectTemplates'],
    queryFn: listProjectTemplates,
  });
}

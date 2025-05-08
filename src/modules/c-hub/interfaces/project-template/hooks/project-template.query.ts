import { useQuery } from '@tanstack/react-query';
import { getProjectTemplateListHandler } from '../project-template.controller';

// CQRS: Query Hook，只負責查詢
export function useProjectTemplateQuery() {
  return useQuery({
    queryKey: ['projectTemplates'],
    queryFn: async () => {
      const result = await getProjectTemplateListHandler();
      // 型別守衛，確保回傳陣列
      return Array.isArray(result) ? result : [];
    },
    staleTime: 1000 * 60, // 1分鐘快取
  });
}

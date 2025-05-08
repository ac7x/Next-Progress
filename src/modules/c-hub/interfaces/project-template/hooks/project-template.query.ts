'use client';

import { listProjectTemplates } from '@/modules/c-hub/application/project-template/project-template-queries';
import { useQuery } from '@tanstack/react-query';

// CQRS: Query Hook，專責查詢
export function useProjectTemplateQuery() {
  return useQuery({
    queryKey: ['projectTemplates'],
    queryFn: async () => {
      const result = await listProjectTemplates();
      // 型別守衛，確保回傳陣列
      return Array.isArray(result) ? result : [];
    },
  });
}

import { listProjectTemplatesQuery } from '@/modules/c-hub/application/project-template/project-template-actions';
import { useQuery } from '@tanstack/react-query';

// CQRS: Query Hook，僅負責查詢
export function useProjectTemplateQuery() {
  return useQuery({
    queryKey: ['projectTemplates'],
    queryFn: listProjectTemplatesQuery,
  });
}

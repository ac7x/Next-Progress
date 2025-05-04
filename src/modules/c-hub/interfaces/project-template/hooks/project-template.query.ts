import { useQuery } from '@tanstack/react-query';
import { getProjectTemplateListHandler } from '../project-template.controller';

// CQRS: Query Controller Hook，僅負責查詢
// 只負責查詢專案模板列表
export function useProjectTemplateQuery() {
  return useQuery({
    queryKey: ['projectTemplates'],
    queryFn: getProjectTemplateListHandler,
  });
}

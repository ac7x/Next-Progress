import { listTaskTemplatesByEngineeringIdQuery } from '@/modules/c-hub/application/task-template/task-template.query';
import { TaskTemplate } from '@/modules/c-hub/domain/task-template/task-template-entity';
import { useQuery } from '@tanstack/react-query';

/**
 * 依工程模板ID查詢任務模板的 React Query hook
 * - 屬於 Query 請求流程的前端查詢發起點
 * - 組裝查詢參數並呼叫 Server Action/Query UseCase
 */
export function useTaskTemplatesByEngineering(engineeringId: string) {
  return useQuery<TaskTemplate[]>({
    queryKey: ['taskTemplates', engineeringId],
    queryFn: () => listTaskTemplatesByEngineeringIdQuery(engineeringId),
    enabled: !!engineeringId,
  });
}

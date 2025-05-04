import { listSubTaskTemplatesByTaskTemplateId } from '@/modules/c-hub/application/sub-task-template/sub-task-template-actions';
import { SubTaskTemplate } from '@/modules/c-hub/domain/sub-task-template/sub-task-template-entity';
import { useQuery } from '@tanstack/react-query';

// 調整 hook 名稱，明確為模板
export function useSubTaskTemplatesByTaskTemplate(taskTemplateId: string) {
  return useQuery<SubTaskTemplate[]>({
    queryKey: ['subTaskTemplates', taskTemplateId],
    queryFn: () => listSubTaskTemplatesByTaskTemplateId(taskTemplateId),
    enabled: !!taskTemplateId,
  });
}

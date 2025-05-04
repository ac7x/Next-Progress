import { listTaskTemplatesByEngineeringId } from '@/modules/c-hub/application/task-template/task-template-actions';
import { TaskTemplate } from '@/modules/c-hub/domain/task-template/task-template-entity';
import { useQuery } from '@tanstack/react-query';

// 明確為模板
export function useTaskTemplatesByEngineeringTemplate(engineeringTemplateId: string) {
  return useQuery<TaskTemplate[]>({
    queryKey: ['taskTemplates', engineeringTemplateId],
    queryFn: () => listTaskTemplatesByEngineeringId(engineeringTemplateId),
    enabled: !!engineeringTemplateId,
  });
}

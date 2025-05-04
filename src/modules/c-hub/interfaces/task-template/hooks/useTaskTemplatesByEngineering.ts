import { listTaskTemplatesByEngineeringIdQuery } from '@/modules/c-hub/application/task-template/task-template.query';
import { TaskTemplate } from '@/modules/c-hub/domain/task-template/task-template-entity';
import { useQuery } from '@tanstack/react-query';

/**
 * 依工程模板ID查詢任務模板的 React Query hook
 * @param engineeringId 工程模板ID
 * @returns { data, isLoading, ... }
 *
 * 使用方式：
 * ```tsx
 * const { data, isLoading } = useTaskTemplatesByEngineering(engineeringId);
 * ```
 */
export function useTaskTemplatesByEngineering(engineeringId: string) {
    return useQuery<TaskTemplate[]>({
        queryKey: ['taskTemplates', engineeringId],
        queryFn: () => listTaskTemplatesByEngineeringIdQuery(engineeringId),
        enabled: !!engineeringId,
    });
}
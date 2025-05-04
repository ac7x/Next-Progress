import { createSubTaskInstance, listSubTasksInstanceByTaskId } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance-actions';
import { SubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 調整 hook 名稱，明確為實體
export function useSubTaskInstancesByTaskInstance(taskInstanceId: string) {
  const queryClient = useQueryClient();

  const query = useQuery<SubTaskInstance[]>({
    queryKey: ['subTaskInstances', taskInstanceId],
    queryFn: () => listSubTasksInstanceByTaskId(taskInstanceId),
    enabled: !!taskInstanceId,
  });

  const create = useMutation({
    mutationFn: createSubTaskInstance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subTaskInstances', taskInstanceId] });
    },
  });

  return { ...query, create };
}

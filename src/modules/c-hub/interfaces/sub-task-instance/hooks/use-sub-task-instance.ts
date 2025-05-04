import { createSubTaskInstanceCommand } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance.command';
import { listSubTasksInstanceByTaskIdQuery } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance.query';
import { SubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useSubTaskInstancesByTaskInstance(taskInstanceId: string) {
  const queryClient = useQueryClient();

  const query = useQuery<SubTaskInstance[]>({
    queryKey: ['subTaskInstances', taskInstanceId],
    queryFn: () => listSubTasksInstanceByTaskIdQuery(taskInstanceId),
    enabled: !!taskInstanceId,
  });

  const create = useMutation({
    mutationFn: createSubTaskInstanceCommand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subTaskInstances', taskInstanceId] });
    },
  });

  return { ...query, create };
}

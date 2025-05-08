import { listSubTasksInstanceByTaskIdQuery } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance.query';
import { SubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { useQuery } from '@tanstack/react-query';

// 僅負責查詢，必須帶上父任務 ID
export function useSubTaskInstancesByTaskInstance(taskInstanceId: string) {
  return useQuery<SubTaskInstance[]>({
    queryKey: ['subTaskInstances', taskInstanceId],
    queryFn: () => listSubTasksInstanceByTaskIdQuery(taskInstanceId),
    enabled: !!taskInstanceId,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

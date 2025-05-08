import { getProjectInstancesTasksCount } from '@/modules/c-hub/application/project-instance/project-instance-tasks-count-actions';
import { useQuery } from '@tanstack/react-query';

// 調整 hook 名稱，明確為實體
export function useProjectInstanceTasksCountQuery(projectInstanceIds: string[]) {
  return useQuery({
    queryKey: ['projectInstancesTasksCount', projectInstanceIds],
    queryFn: () => getProjectInstancesTasksCount(projectInstanceIds),
    enabled: projectInstanceIds.length > 0,
    staleTime: 60 * 1000, // 1分鐘快取
  });
}

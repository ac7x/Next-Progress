import { SubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { SubTaskInstanceDetails } from './sub-task-instance-details';

export function SubTaskInstanceList({ subTaskInstances }: { subTaskInstances: SubTaskInstance[] }) {
  if (subTaskInstances.length === 0) {
    return <p className="text-sm text-gray-500">此任務尚無子任務</p>;
  }

  // 按優先級和狀態排序
  const sortedSubTaskInstances = [...subTaskInstances].sort((a, b) => {
    // 首先按優先級排序（數字越小，優先級越高）
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    // 如果優先級相同，則按狀態排序（待處理 > 進行中 > 已完成）
    const statusOrder: Record<string, number> = {
      'TODO': 0,
      'IN_PROGRESS': 1,
      'DONE': 2
    };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div className="space-y-2">
      {sortedSubTaskInstances.map((subTaskInstance) => (
        <SubTaskInstanceDetails
          key={subTaskInstance.id}
          subTaskInstance={subTaskInstance}
        />
      ))}
    </div>
  );
}

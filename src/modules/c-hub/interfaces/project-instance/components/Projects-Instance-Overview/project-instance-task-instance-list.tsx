import { SubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance';
import { TaskInstance } from '@/modules/c-hub/domain/task-instance';
// 新增：引入 TaskWithSubTasks
import { TaskWithSubTasks } from './project-instance-engineering-list';

interface Props {
    taskInstances: TaskInstance[];
    subTaskInstancesMap: Record<string, SubTaskInstance[]>;
    taskUpdating: Record<string, boolean>;
    taskUpdateError: Record<string, string | null>;
    subTaskUpdating: Record<string, boolean>;
    subTaskUpdateError: Record<string, string | null>;
    onTaskActualEquipmentCountChange: (taskId: string, value: number) => void;
    onSubTaskActualEquipmentCountChange: (subTaskId: string, value: number, parentTaskId: string) => void;
}

export function TaskInstanceList({
    taskInstances,
    subTaskInstancesMap,
    taskUpdating,
    taskUpdateError,
    subTaskUpdating,
    subTaskUpdateError,
    onTaskActualEquipmentCountChange,
    onSubTaskActualEquipmentCountChange
}: Props) {
    if (!taskInstances || taskInstances.length === 0) return null;
    return (
        <div className="mt-4 border-t pt-4">
            <h4 className="font-medium mb-2 text-lg">直接關聯專案的任務</h4>
            <div className="space-y-2">
                {taskInstances.map(taskInstance => (
                    <TaskWithSubTasks
                        key={taskInstance.id}
                        taskInstance={taskInstance}
                        subTaskInstances={subTaskInstancesMap[taskInstance.id] || []}
                        taskUpdating={taskUpdating[taskInstance.id]}
                        taskUpdateError={taskUpdateError[taskInstance.id]}
                        subTaskUpdating={subTaskUpdating}
                        subTaskUpdateError={subTaskUpdateError}
                        onTaskActualEquipmentCountChange={onTaskActualEquipmentCountChange}
                        onSubTaskActualEquipmentCountChange={onSubTaskActualEquipmentCountChange}
                    />
                ))}
            </div>
        </div>
    );
}

// 移除循環 re-export，僅保留 ProjectInstanceTaskInstanceList 導出
export { TaskInstanceList as ProjectInstanceTaskInstanceList };


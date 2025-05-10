import { TaskInstance } from '@/modules/c-hub/domain/task-instance';

export function TaskInstanceSummaryCard({ taskInstance }: { taskInstance: TaskInstance }) {
    return (
        <div className="border rounded p-3 bg-white flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="font-medium text-base">{taskInstance.name}</span>
                <span className="text-xs text-gray-500">
                    狀態: {taskInstance.status === 'TODO' ? '待處理' : taskInstance.status === 'IN_PROGRESS' ? '進行中' : '已完成'}
                </span>
            </div>
            <div className="flex gap-4 text-sm">
                <div>
                    <span className="text-gray-600">預計數量：</span>
                    <span className="font-mono">{taskInstance.equipmentCount ?? 0}</span>
                </div>
                <div>
                    <span className="text-gray-600">實際完成數量：</span>
                    <span className="font-mono">{taskInstance.actualEquipmentCount ?? 0}</span>
                </div>
                <div>
                    <span className="text-gray-600">完成率：</span>
                    <span className="font-mono">{taskInstance.completionRate ?? 0}%</span>
                </div>
            </div>
        </div>
    );
}

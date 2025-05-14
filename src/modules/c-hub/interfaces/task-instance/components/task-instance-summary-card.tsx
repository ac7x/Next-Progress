import { TaskInstance } from '@/modules/c-hub/domain/task-instance';

export function TaskInstanceSummaryCard({ taskInstance, onSplitTask }: {
    taskInstance: TaskInstance;
    onSplitTask?: (task: TaskInstance) => void;
}) {
    return (
        <div className="border rounded p-3 bg-white flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="font-medium text-base">{taskInstance.name}</span>
                <div className="flex gap-2 items-center">
                    <span className="text-xs text-gray-500">
                        狀態: {
                            taskInstance.completionRate === 0 ? '待處理' :
                                taskInstance.completionRate === 100 ? '已完成' :
                                    '進行中'
                        }
                    </span>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSplitTask?.(taskInstance);
                        }}
                        className="text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded border border-blue-200 flex items-center"
                        title="分割子任務"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M5 11h14" />
                        </svg>
                        分割子任務
                    </button>
                </div>
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

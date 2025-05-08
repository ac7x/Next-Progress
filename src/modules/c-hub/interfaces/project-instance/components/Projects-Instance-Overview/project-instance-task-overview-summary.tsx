import { TaskInstance } from '@/modules/c-hub/domain/task-instance/task-instance-entity';

export function TaskOverviewSummary({ taskInstances }: { taskInstances: TaskInstance[] }) {
    return (
        <div className="mt-4 border-t pt-4">
            <h4 className="font-medium mb-2 text-lg">任務總覽</h4>
            {taskInstances.length === 0 ? (
                <p className="text-gray-500">此專案尚無任務</p>
            ) : (
                <>
                    <p className="text-sm mb-2">共 {taskInstances.length} 個任務</p>
                    <div className="flex gap-2">
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            待處理: {taskInstances.filter(t => t.status === 'TODO').length}
                        </div>
                        <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                            進行中: {taskInstances.filter(t => t.status === 'IN_PROGRESS').length}
                        </div>
                        <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            已完成: {taskInstances.filter(t => t.status === 'DONE').length}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export { TaskOverviewSummary as ProjectInstanceTaskOverviewSummary };

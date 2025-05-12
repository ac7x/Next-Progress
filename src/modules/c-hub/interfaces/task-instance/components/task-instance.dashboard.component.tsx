'use client';

import { PriorityFormatter } from '@/modules/c-hub/domain/project-instance/value-objects/priority-formatter';
import { useState } from 'react';
import { useTaskInstancesByProject } from '../hooks/task-instance.use-query.hook';
import { TaskInstanceSubTaskInstancesSection } from '../index';
import { TaskInstanceSummaryCard } from './task-instance-summary-card';

interface TaskInstanceDashboardProps {
    initialProjectId?: string;
}

export function TaskInstanceDashboard({ initialProjectId = '' }: TaskInstanceDashboardProps) {
    const [projectId, setProjectId] = useState(initialProjectId);
    const { data: tasks = [], isLoading, error } = useTaskInstancesByProject(projectId);

    // 排序任務：先按優先級，再按完成率（未完成優先）
    const sortedTasks = [...tasks].sort((a, b) => {
        // 先比較優先級（數字越小優先級越高）
        const priorityDiff = (a.priority ?? 0) - (b.priority ?? 0);
        if (priorityDiff !== 0) return priorityDiff;

        // 再比較完成率（未完成的排前面）
        const aIsDone = a.status === 'DONE' || a.completionRate === 100;
        const bIsDone = b.status === 'DONE' || b.completionRate === 100;
        return aIsDone === bIsDone ? 0 : aIsDone ? 1 : -1;
    });

    if (error) {
        return (
            <div className="p-6">
                <div className="p-4 bg-red-50 text-red-700 rounded-md">
                    <p>無法載入任務資料，請稍後再試</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">所有任務</h2>
                <span className="text-gray-500 text-sm">
                    {isLoading ? '載入中...' : `共 ${tasks.length} 項`}
                </span>
            </div>

            {isLoading ? (
                <div className="p-4 text-center">
                    <p className="text-gray-500">載入任務中...</p>
                </div>
            ) : tasks.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-3">目前沒有任務</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {sortedTasks.map((task) => (
                        <div key={task.id} className="space-y-2 bg-gray-50 p-4 rounded-lg">
                            {/* 優先級指示器與任務卡片 */}
                            <div className="flex items-center gap-2">
                                <div className={`flex items-center gap-1 w-32 ${PriorityFormatter.getTextColorClass(task.priority ?? 0)}`}>
                                    <div className={`w-3 h-3 rounded-full ${PriorityFormatter.getColorClass(task.priority ?? 0)}`}></div>
                                    <span className="text-xs">
                                        優先級 {task.priority ?? 0} - {PriorityFormatter.toLabel(task.priority ?? 0)}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <TaskInstanceSummaryCard taskInstance={task} />
                                </div>
                            </div>

                            {/* 子任務區塊 */}
                            <TaskInstanceSubTaskInstancesSection taskInstanceId={task.id} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

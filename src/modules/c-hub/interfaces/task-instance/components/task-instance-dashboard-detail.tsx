'use client';

import { TaskInstance } from '@/modules/c-hub/domain/task-instance';
import { SubTaskInstanceList } from '@/modules/c-hub/interfaces/sub-task-instance/components/sub-task-instance-list';
import { useSubTaskInstancesByTaskInstance } from '@/modules/c-hub/interfaces/sub-task-instance/hooks/use-sub-task-instance';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { TaskInstanceSplitSubtaskForm } from './task-instance-split-subtask-form';
import { TaskInstanceSummaryCard } from './task-instance-summary-card';

interface TaskInstanceDashboardDetailProps {
    taskInstance: TaskInstance;
}

export function TaskInstanceDashboardDetail({ taskInstance }: TaskInstanceDashboardDetailProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSplitForm, setShowSplitForm] = useState(false);
    const queryClient = useQueryClient();

    // 使用現有 hook 來查詢子任務資料
    const {
        data: subTasks = [],
        isLoading: isSubTasksLoading,
        error: subTasksError
    } = useSubTaskInstancesByTaskInstance(taskInstance.id);

    // 根據完成率計算進度條顏色樣式
    const getProgressColorClass = () => {
        const rate = taskInstance.completionRate || 0;
        if (rate >= 70) return 'bg-green-500';
        if (rate >= 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    // 處理顯示分割表單的函數
    const handleSplitTask = () => {
        setShowSplitForm(true);
    };

    // 處理關閉分割表單的函數，完成後刷新數據
    const handleCloseSplitForm = () => {
        setShowSplitForm(false);
        // 重新整理子任務資料
        queryClient.invalidateQueries({
            queryKey: ['subTaskInstances', taskInstance.id]
        });
        // 重新整理所有任務資料（包括父任務）
        queryClient.invalidateQueries({
            queryKey: ['taskInstances']
        });
        queryClient.invalidateQueries({
            queryKey: ['allTasks']
        });
    };

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm mb-4">
            {/* 任務摘要資訊 */}
            <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <TaskInstanceSummaryCard
                    taskInstance={taskInstance}
                    onSplitTask={() => handleSplitTask()}
                />

                {/* 進度條 */}
                <div className="mt-2">
                    <div className="w-full h-1.5 bg-gray-200 rounded-full">
                        <div
                            className={`h-full rounded-full ${getProgressColorClass()}`}
                            style={{ width: `${taskInstance.completionRate || 0}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* 展開後顯示子任務 */}
            {isExpanded && (
                <div className="mt-4 pt-3 border-t border-dashed">
                    <h4 className="font-medium text-sm mb-2">子任務列表</h4>
                    {isSubTasksLoading ? (
                        <p className="text-sm text-gray-500">載入子任務中...</p>
                    ) : subTasksError ? (
                        <p className="text-sm text-red-500">無法載入子任務</p>
                    ) : (
                        <SubTaskInstanceList subTaskInstances={subTasks} />
                    )}
                </div>
            )}

            {/* 子任務分割表單 */}
            {showSplitForm && (
                <TaskInstanceSplitSubtaskForm
                    taskInstance={taskInstance}
                    onCloseAction={handleCloseSplitForm}
                />
            )}
        </div>
    );
}

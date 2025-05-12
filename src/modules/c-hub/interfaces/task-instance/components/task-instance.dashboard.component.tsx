'use client';

import { useDashboardData } from '@/modules/c-hub/interfaces/dashboard/hooks/use-dashboard-data';
import { useState } from 'react';
import { TaskInstanceDashboardDetail } from './task-instance-dashboard-detail';

interface TaskInstanceDashboardProps {
    initialProjectId?: string;
}

export function TaskInstanceDashboard({ initialProjectId = '' }: TaskInstanceDashboardProps) {
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const { tasks = [], isLoading, error } = useDashboardData();

    // 排序與篩選任務
    const filteredAndSortedTasks = tasks
        .filter(task => statusFilter === 'ALL' ? true : task.status === statusFilter)
        .sort((a, b) => {
            // 先比較優先級（數字越小優先級越高）
            const priorityDiff = (a.priority ?? 0) - (b.priority ?? 0);
            if (priorityDiff !== 0) return priorityDiff;

            // 再比較完成率（未完成的排前面）
            return (a.completionRate ?? 0) - (b.completionRate ?? 0);
        });

    // 計算任務統計資訊
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'DONE').length;
    const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS').length;
    const pendingTasks = tasks.filter(task => task.status === 'TODO').length;

    if (error) {
        return (
            <div className="p-6 bg-red-50 text-red-700 rounded-md">
                <p>無法載入任務資料，請稍後再試</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 狀態篩選與統計摘要 */}
            <div className="flex flex-wrap justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-2 mb-2 sm:mb-0">
                    <button
                        onClick={() => setStatusFilter('ALL')}
                        className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'ALL'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'}`}
                    >
                        全部 ({totalTasks})
                    </button>
                    <button
                        onClick={() => setStatusFilter('TODO')}
                        className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'TODO'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-200 text-gray-700'}`}
                    >
                        待處理 ({pendingTasks})
                    </button>
                    <button
                        onClick={() => setStatusFilter('IN_PROGRESS')}
                        className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'IN_PROGRESS'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'}`}
                    >
                        進行中 ({inProgressTasks})
                    </button>
                    <button
                        onClick={() => setStatusFilter('DONE')}
                        className={`px-3 py-1 text-sm rounded-full ${statusFilter === 'DONE'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700'}`}
                    >
                        已完成 ({completedTasks})
                    </button>
                </div>
                <span className="text-gray-500 text-sm">
                    {isLoading ? '載入中...' : `共 ${filteredAndSortedTasks.length} 項`}
                </span>
            </div>

            {/* 任務列表 */}
            {isLoading ? (
                <div className="p-4 text-center">
                    <p className="text-gray-500">載入任務中...</p>
                </div>
            ) : filteredAndSortedTasks.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-3">
                        {statusFilter === 'ALL' ? '目前沒有任務' : `沒有${statusFilter === 'TODO' ? '待處理' :
                                statusFilter === 'IN_PROGRESS' ? '進行中' : '已完成'
                            }的任務`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAndSortedTasks.map((task) => (
                        <TaskInstanceDashboardDetail key={task.id} taskInstance={task} />
                    ))}
                </div>
            )}
        </div>
    );
}

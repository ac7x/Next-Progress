'use client';

import { useDashboardData } from '@/modules/c-hub/interfaces/dashboard/hooks/use-dashboard-data';
import { useCallback, useEffect, useState } from 'react';
import { TaskInstanceDashboardDetail } from './task-instance-dashboard-detail';

interface TaskInstanceDashboardProps {
    initialProjectId?: string;
}

export function TaskInstanceDashboard({ initialProjectId = '' }: TaskInstanceDashboardProps) {
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const { tasks = [], isLoading, error } = useDashboardData();

    // 增加一個調試用的狀態
    const [debug, setDebug] = useState({
        tasksCount: 0,
        lastUpdated: new Date().toISOString(),
    });

    // 當任務數據變化時更新調試信息
    useEffect(() => {
        setDebug({
            tasksCount: tasks?.length || 0,
            lastUpdated: new Date().toISOString(),
        });
        console.log('Dashboard任務數據更新:', tasks);
    }, [tasks]);

    // 排序與篩選任務
    const filteredAndSortedTasks = Array.isArray(tasks) ? tasks
        .filter(task => statusFilter === 'ALL' ? true : task.status === statusFilter)
        .sort((a, b) => {
            // 先比較優先級（數字越小優先級越高）
            const priorityDiff = (a.priority ?? 0) - (b.priority ?? 0);
            if (priorityDiff !== 0) return priorityDiff;

            // 再比較完成率（未完成的排前面）
            return (a.completionRate ?? 0) - (b.completionRate ?? 0);
        }) : [];

    // 計算任務統計資訊
    const totalTasks = Array.isArray(tasks) ? tasks.length : 0;
    const completedTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'DONE').length : 0;
    const inProgressTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'IN_PROGRESS').length : 0;
    const pendingTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === 'TODO').length : 0;

    // 手動刷新處理函數
    const handleRefresh = useCallback(() => {
        window.location.reload();
    }, []);

    if (error) {
        return (
            <div className="p-6 bg-red-50 text-red-700 rounded-md">
                <p>無法載入任務資料，請稍後再試</p>
                <div className="mt-2">
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-1 bg-red-600 text-white rounded-md text-sm"
                    >
                        重新載入
                    </button>
                </div>
                <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto">
                    {error instanceof Error ? error.message : '未知錯誤'}
                </pre>
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

            {/* 調試信息(開發環境) */}
            {process.env.NODE_ENV !== 'production' && (
                <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                    <p>調試信息: 總任務數: {debug.tasksCount} | 最後更新: {debug.lastUpdated}</p>
                    <button
                        onClick={handleRefresh}
                        className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs mt-1"
                    >
                        強制刷新
                    </button>
                </div>
            )}

            {/* 任務列表 */}
            {isLoading ? (
                <div className="p-10 text-center bg-white rounded-lg shadow">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                    <p className="text-gray-500 mt-4">載入任務中...</p>
                </div>
            ) : !Array.isArray(tasks) ? (
                <div className="text-center py-10 bg-red-50 rounded-lg">
                    <p className="text-red-600 mb-3">獲取數據格式錯誤</p>
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-1 bg-red-600 text-white rounded-md text-sm"
                    >
                        重新載入
                    </button>
                </div>
            ) : filteredAndSortedTasks.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                    <p className="text-gray-500 mb-3">
                        {statusFilter === 'ALL' ? '目前沒有任務' : `沒有${statusFilter === 'TODO' ? '待處理' :
                            statusFilter === 'IN_PROGRESS' ? '進行中' : '已完成'
                            }的任務`}
                    </p>
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
                    >
                        重新載入
                    </button>
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

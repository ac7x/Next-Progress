'use client';

/**
 * 任務實體詳細資訊元件
 * 功能：展示單一任務的詳細資料，支援展開子任務區塊
 * 使用方式：
 * <TaskInstanceDetails taskInstance={taskInstance} />
 */

import { TaskInstance } from '@/modules/c-hub/domain/task-instance';
import { useState } from 'react';
import TaskInstanceSubTaskInstancesSection from './task-instance-sub-task-instances-section';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaskInstanceCommand } from '@/modules/c-hub/application/task-instance/task-instance.command';

interface TaskInstanceDetailsProps {
  taskInstance: TaskInstance;
}

export function TaskInstanceDetails({ taskInstance }: TaskInstanceDetailsProps) {
  const [isSubTasksVisible, setIsSubTasksVisible] = useState(false);
  const [isTaskExpanded, setIsTaskExpanded] = useState(false);

  // React Query
  const queryClient = useQueryClient();
  const { mutate: updatePriority, isPending: isPriorityUpdating } = useMutation({
    mutationFn: async (newPriority: number) =>
      updateTaskInstanceCommand(taskInstance.id, { priority: newPriority }),
    onSuccess: () => {
      // 只刷新該任務列表
      queryClient.invalidateQueries({ queryKey: ['taskInstances'] });
      // 也刷新單一任務（如有）
      queryClient.invalidateQueries({ queryKey: ['taskInstance', taskInstance.id] });
    }
  });

  // 根據完成率生成顯示樣式
  const getCompletionRateStyle = () => {
    const rate = taskInstance.completionRate || 0;
    let bgColor = 'bg-red-200';
    if (rate >= 70) bgColor = 'bg-green-200';
    else if (rate >= 30) bgColor = 'bg-yellow-200';

    return {
      width: `${rate}%`,
      backgroundColor: bgColor.replace('bg-', '')
    };
  };

  const toggleSubTasks = () => {
    setIsSubTasksVisible(!isSubTasksVisible);
  };

  const toggleTaskDetails = () => {
    setIsTaskExpanded(!isTaskExpanded);
  };

  // Inline 優先級調整（數字型，無上下限，建議 0~9）
  const handlePriorityChange = (delta: number) => {
    let newPriority = (taskInstance.priority ?? 0) + delta;
    if (newPriority < 0) newPriority = 0;
    if (newPriority > 9) newPriority = 9;
    if (newPriority !== taskInstance.priority) {
      updatePriority(newPriority);
    }
  };

  return (
    <div className="border rounded-md p-3 mb-3 bg-white shadow-sm">
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleTaskDetails}>
        <div className="flex-1">
          <h3 className="font-medium">{taskInstance.name}</h3>
          {isTaskExpanded && taskInstance.description && (
            <p className="text-sm text-gray-600 mt-1">{taskInstance.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {/* 任務狀態顯示 */}
          <span className={`px-2 py-1 text-xs rounded-full ${taskInstance.status === 'DONE' ? 'bg-green-100 text-green-800' :
            taskInstance.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
            {taskInstance.status === 'DONE' ? '已完成' :
              taskInstance.status === 'IN_PROGRESS' ? '進行中' : '待處理'}
          </span>

          {/* 完成率進度條 */}
          <div className="flex items-center">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={getCompletionRateStyle()}
              ></div>
            </div>
            <span className="text-xs text-gray-500 ml-1">{taskInstance.completionRate || 0}%</span>
          </div>

          {/* Inline 優先級調整（數字） */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="px-1 text-xs border rounded disabled:opacity-50"
              disabled={isPriorityUpdating || (taskInstance.priority ?? 0) <= 0}
              onClick={e => {
                e.stopPropagation();
                handlePriorityChange(-1);
              }}
              title="提升優先級"
            >▲</button>
            <span className="text-xs font-semibold min-w-[2em] text-center">
              {(taskInstance.priority ?? 0)}
            </span>
            <button
              type="button"
              className="px-1 text-xs border rounded disabled:opacity-50"
              disabled={isPriorityUpdating || (taskInstance.priority ?? 0) >= 9}
              onClick={e => {
                e.stopPropagation();
                handlePriorityChange(1);
              }}
              title="降低優先級"
            >▼</button>
          </div>

          {/* 展開/收起子任務按鈕 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSubTasks();
            }}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            {isSubTasksVisible ? '收起子任務' : '查看子任務'} ▾
          </button>
        </div>
      </div>

      {/* 任務詳細信息 */}
      {isTaskExpanded && (
        <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">計劃開始時間: </span>
            {taskInstance.plannedStart ? new Date(taskInstance.plannedStart).toLocaleDateString() : '未設定'}
          </div>
          <div>
            <span className="text-gray-500">計劃結束時間: </span>
            {taskInstance.plannedEnd ? new Date(taskInstance.plannedEnd).toLocaleDateString() : '未設定'}
          </div>
          <div>
            <span className="text-gray-500">優先級: </span>
            {(taskInstance.priority ?? 0)}
          </div>
          <div>
            <span className="text-gray-500">設備數量: </span>
            {taskInstance.equipmentCount || 0} ({taskInstance.actualEquipmentCount || 0} 實際使用)
          </div>
        </div>
      )}

      {/* 子任務列表區塊 */}
      {isSubTasksVisible && (
        <div className="mt-3 pt-3 border-t border-dashed">
          <TaskInstanceSubTaskInstancesSection taskInstanceId={taskInstance.id} />
        </div>
      )}
    </div>
  );
}
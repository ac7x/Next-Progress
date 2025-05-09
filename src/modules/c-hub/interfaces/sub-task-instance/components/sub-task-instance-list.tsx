'use client';

import { SubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { SubTaskInstanceDetails } from './sub-task-instance-details';

/**
 * 子任務列表元件
 * 負責顯示子任務列表，提供子任務的簡略信息和詳情展開功能
 * @param subTaskInstances 子任務實例陣列
 */
export function SubTaskInstanceList({ subTaskInstances }: { subTaskInstances: SubTaskInstance[] }) {
  // 若無子任務，顯示提示信息
  if (!subTaskInstances || subTaskInstances.length === 0) {
    return <div className="text-sm text-gray-500 italic">尚無子任務</div>;
  }

  // 根據優先級排序子任務
  const sortedSubTasks = [...subTaskInstances].sort((a, b) => a.priority - b.priority);

  return (
    <div className="space-y-3 mt-3">
      <h4 className="text-sm font-medium">子任務列表</h4>
      {sortedSubTasks.map(subTaskInstance => (
        <div key={subTaskInstance.id} className="border rounded p-2 bg-white shadow-sm">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${subTaskInstance.status === 'DONE'
                  ? 'bg-green-500'
                  : subTaskInstance.status === 'IN_PROGRESS'
                    ? 'bg-blue-500'
                    : 'bg-gray-400'
                }`}
            />
            <div className="flex-1">
              <span className="font-medium text-sm">{subTaskInstance.name}</span>
              <span className="text-xs text-gray-500 ml-2">
                狀態: {subTaskInstance.status === 'TODO' ? '待處理' : subTaskInstance.status === 'IN_PROGRESS' ? '進行中' : '已完成'}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              完成率: {subTaskInstance.completionRate ?? 0}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1 text-xs text-gray-600">
            <div>
              預計開始: {subTaskInstance.plannedStart ? new Date(subTaskInstance.plannedStart).toLocaleDateString() : '—'}
            </div>
            <div>
              預計數量: {subTaskInstance.equipmentCount ?? 0}
            </div>
          </div>
          {/* 詳細操作區塊（如進度、刪除等） */}
          <div className="mt-2">
            <SubTaskInstanceDetails subTaskInstance={subTaskInstance} />
          </div>
        </div>
      ))}
    </div>
  );
}

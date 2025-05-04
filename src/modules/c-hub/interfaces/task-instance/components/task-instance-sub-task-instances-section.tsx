'use client';

import { SubTaskInstanceForm } from '@/modules/c-hub/interfaces/sub-task-instance/components/sub-task-instance-form';
import { SubTaskInstanceList } from '@/modules/c-hub/interfaces/sub-task-instance/components/sub-task-instance-list';
import { useSubTaskInstancesByTaskInstance } from '@/modules/c-hub/interfaces/sub-task-instance/hooks/use-sub-task-instance';
import { useState } from 'react';

interface TaskInstanceSubTaskInstancesSectionProps {
  taskInstanceId: string;
}

// 調整元件名稱與 props
export function TaskInstanceSubTaskInstancesSection({ taskInstanceId }: TaskInstanceSubTaskInstancesSectionProps) {
  const { data: subTaskInstances = [], isLoading, error } = useSubTaskInstancesByTaskInstance(taskInstanceId);
  const [showAddForm, setShowAddForm] = useState(false);

  if (isLoading) {
    return <div className="py-2 text-sm text-gray-500">載入子任務中...</div>;
  }

  if (error) {
    return <div className="py-2 text-sm text-red-500">{(error as Error).message}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-medium">子任務列表</h4>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showAddForm ? '取消' : '+ 新增子任務'}
        </button>
      </div>
      {showAddForm && (
        <div className="mb-4">
          <SubTaskInstanceForm
            taskInstanceId={taskInstanceId}
            onCreated={() => setShowAddForm(false)}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}
      <SubTaskInstanceList subTaskInstances={subTaskInstances} />
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export function SubTaskInstanceForm({
  taskInstanceId,
  action
}: {
  taskInstanceId: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  async function handleSubmit(formData: FormData) {
    await action(formData);
    // 新增：刷新子任務列表（CQRS Query Concern）
    await queryClient.invalidateQueries({ queryKey: ['subTaskInstances', taskInstanceId] });
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="bg-white p-3 rounded border space-y-2">
      <input type="hidden" name="taskInstanceId" value={taskInstanceId} />

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">預計施工日期</label>
          <input
            type="date"
            name="plannedStart"
            className="w-full p-1.5 text-sm border rounded"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">預計數量</label>
          <input
            type="number"
            name="equipmentCount"
            min="0"
            className="w-full p-1.5 text-sm border rounded"
          />
        </div>
      </div>

      <button type="submit" className="px-2 py-1 bg-blue-500 text-white rounded">新增子任務</button>
    </form>
  );
}

// 表單已精簡，僅收集必要資料

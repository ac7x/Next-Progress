'use client';

import { createSubTaskInstance } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance-actions';
import { useRouter } from 'next/navigation';

export function SubTaskInstanceForm({ taskInstanceId }: { taskInstanceId: string }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    'use server';
    const name = formData.get('name')?.toString() || '';
    const description = formData.get('description')?.toString() || null;
    const priority = Number(formData.get('priority'));
    const status = formData.get('status')?.toString() as any;
    await createSubTaskInstance({ name, description, taskId: taskInstanceId, priority, status });
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="bg-white p-3 rounded border space-y-2">
      <div className="mb-2">
        <input
          type="text"
          name="name"
          placeholder="子任務名稱"
          className="w-full p-1.5 text-sm border rounded"
          required
        />
      </div>

      <div className="mb-2">
        <textarea
          name="description"
          placeholder="描述 (選填)"
          className="w-full p-1.5 text-sm border rounded"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">優先級</label>
          <select
            name="priority"
            className="w-full p-1.5 text-sm border rounded"
          >
            <option value={0}>高</option>
            <option value={1}>中</option>
            <option value={2}>低</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">狀態</label>
          <select
            name="status"
            className="w-full p-1.5 text-sm border rounded"
          >
            <option value="TODO">待處理</option>
            <option value="IN_PROGRESS">進行中</option>
            <option value="DONE">已完成</option>
          </select>
        </div>
      </div>

      <button type="submit" className="px-2 py-1 bg-blue-500 text-white rounded">新增子任務</button>
    </form>
  );
}

'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * 子任務表單元件
 * 負責創建新的子任務
 * @param taskInstanceId 父任務ID
 * @param action Server Action 處理函數
 */
export function SubTaskInstanceForm({
  taskInstanceId,
  action
}: {
  taskInstanceId: string;
  action: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [equipmentCount, setEquipmentCount] = useState<number | undefined>(undefined);
  const [plannedDate, setPlannedDate] = useState<string>('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const form = e.currentTarget;
      const formData = new FormData(form);

      // 添加 taskInstanceId，確保 Server Action 知道父任務
      formData.set('taskInstanceId', taskInstanceId);

      // 調用 Server Action 創建子任務
      await action(formData);

      // 重新驗證查詢並重置表單
      await queryClient.invalidateQueries({
        queryKey: ['subTaskInstances', taskInstanceId]
      });

      router.refresh();
      form.reset();
      setEquipmentCount(undefined);
      setPlannedDate('');
    } catch (err) {
      console.error('建立子任務失敗:', err);
      setError(err instanceof Error ? err.message : '建立子任務失敗');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded bg-gray-50">
      <h4 className="text-sm font-medium mb-2">新增子任務</h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label htmlFor="description" className="block text-xs text-gray-600">
            描述（選填）
          </label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="子任務描述"
            className="w-full p-1 border rounded text-sm"
          />
        </div>

        <div>
          <label htmlFor="equipmentCount" className="block text-xs text-gray-600">
            預計設備數量
          </label>
          <input
            type="number"
            id="equipmentCount"
            name="equipmentCount"
            min="0"
            value={equipmentCount ?? ''}
            onChange={(e) => setEquipmentCount(e.target.value ? Number(e.target.value) : undefined)}
            placeholder="0"
            className="w-full p-1 border rounded text-sm"
          />
        </div>

        <div>
          <label htmlFor="plannedStart" className="block text-xs text-gray-600">
            預計開始日期
          </label>
          <input
            type="date"
            id="plannedStart"
            name="plannedStart"
            value={plannedDate}
            onChange={(e) => setPlannedDate(e.target.value)}
            className="w-full p-1 border rounded text-sm"
          />
        </div>
      </div>

      {error && <div className="text-red-500 text-xs mt-2">{error}</div>}

      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-3 py-1 rounded text-sm ${isSubmitting
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
        >
          {isSubmitting ? '處理中...' : '新增子任務'}
        </button>
      </div>
    </form>
  );
}

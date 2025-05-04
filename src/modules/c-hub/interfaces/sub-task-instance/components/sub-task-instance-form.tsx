'use client';

import { createSubTaskInstance } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance-actions';
import { SubTaskInstanceStatus } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { useState } from 'react';

export interface CreateSubTaskInstanceFormProps {
  taskInstanceId: string;
  onCreated?: () => void;
  onCancel?: () => void;
  // ...其他 props...
}

// 調整元件名稱與 props
export function SubTaskInstanceForm({
  taskInstanceId,
  onCreated,
  onCancel,
  // ...props...
}: CreateSubTaskInstanceFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<number>(1); // 默認中優先級
  const [status, setStatus] = useState<SubTaskInstanceStatus>('TODO');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('子任務名稱不能為空');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createSubTaskInstance({
        name,
        description: description || null,
        taskId: taskInstanceId, // 注意這裡是 taskInstanceId
        priority,
        status
      });

      // 重置表單
      setName('');
      setDescription('');
      setPriority(1);
      setStatus('TODO');

      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立子任務失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-3 rounded border">
      <h4 className="text-sm font-medium mb-2">新增子任務</h4>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-100 text-red-600 text-xs rounded">
          {error}
        </div>
      )}

      <div className="mb-2">
        <input
          type="text"
          placeholder="子任務名稱"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-1.5 text-sm border rounded"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="mb-2">
        <textarea
          placeholder="描述 (選填)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-1.5 text-sm border rounded"
          rows={2}
          disabled={isSubmitting}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">優先級</label>
          <select
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="w-full p-1.5 text-sm border rounded"
            disabled={isSubmitting}
          >
            <option value={0}>高</option>
            <option value={1}>中</option>
            <option value={2}>低</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-600 mb-1">狀態</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as SubTaskInstanceStatus)}
            className="w-full p-1.5 text-sm border rounded"
            disabled={isSubmitting}
          >
            <option value="TODO">待處理</option>
            <option value="IN_PROGRESS">進行中</option>
            <option value="DONE">已完成</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-2 py-1 text-sm border rounded"
            disabled={isSubmitting}
          >
            取消
          </button>
        )}

        <button
          type="submit"
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? '建立中...' : '建立子任務'}
        </button>
      </div>
    </form>
  );
}

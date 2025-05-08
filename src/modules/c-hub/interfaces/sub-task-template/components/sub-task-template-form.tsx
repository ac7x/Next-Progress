'use client';

import { createSubTaskTemplate } from '@/modules/c-hub/application/sub-task-template/sub-task-template-actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface SubTaskTemplateFormProps {
  taskTemplateId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// 調整元件名稱與 props
export function SubTaskTemplateForm({ taskTemplateId, onSuccess, onCancel }: SubTaskTemplateFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('子任務模板名稱不能為空');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createSubTaskTemplate({
        name,
        description: description || null,
        taskTemplateId,
        priority,
        isActive: true
      });

      setName('');
      setDescription('');
      setPriority(0);

      if (onSuccess) {
        onSuccess();
      }

      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : '建立子任務模板失敗');
      console.error('建立子任務模板失敗:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2 text-red-600 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          子任務模板名稱
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="輸入子任務模板名稱"
          required
          disabled={isSubmitting}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          描述（可選）
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="輸入描述（可選）"
          disabled={isSubmitting}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium mb-1">
          優先級
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          className="w-full p-2 border rounded"
          disabled={isSubmitting}
        >
          <option value="0">高</option>
          <option value="1">中</option>
          <option value="2">低</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
            disabled={isSubmitting}
          >
            取消
          </button>
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? '處理中...' : '新增子任務模板'}
        </button>
      </div>
    </form>
  );
}

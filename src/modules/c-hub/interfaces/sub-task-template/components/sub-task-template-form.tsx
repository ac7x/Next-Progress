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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!name.trim()) {
        throw new Error('子任務名稱不能為空');
      }

      await createSubTaskTemplate({
        name,
        description: description || null,
        taskTemplateId
      });

      setName('');
      setDescription('');

      if (onSuccess) onSuccess();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立子任務模板失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2 text-red-600 bg-red-50 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          子任務名稱
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="子任務名稱"
          required
          disabled={isSubmitting}
          className="w-full p-2 border rounded text-sm"
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
          placeholder="描述（可選）"
          disabled={isSubmitting}
          className="w-full p-2 border rounded text-sm"
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 border rounded hover:bg-gray-100 text-sm"
            disabled={isSubmitting}
          >
            取消
          </button>
        )}
        <button
          type="submit"
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? '處理中...' : '新增子任務模板'}
        </button>
      </div>
    </form>
  );
}

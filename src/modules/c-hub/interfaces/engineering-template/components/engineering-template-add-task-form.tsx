'use client';

import { createTaskTemplate } from '@/modules/c-hub/application/task-template/task-template-actions';
import { EngineeringTemplate } from '@/modules/c-hub/domain/engineering-template/engineering-template-entity';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface EngineeringTemplateAddTaskFormProps {
  engineeringTemplate: EngineeringTemplate;
  onCancelAction: () => void;
  onSuccessAction?: () => void;
}

// 調整元件名稱與 props
export function EngineeringTemplateAddTaskForm({
  engineeringTemplate,
  onCancelAction,
  onSuccessAction
}: EngineeringTemplateAddTaskFormProps) {
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
        throw new Error('任務名稱不能為空');
      }

      await createTaskTemplate({
        name,
        description: description || null,
        engineeringId: engineeringTemplate.id,
        isActive: true
      });

      setName('');
      setDescription('');
      router.refresh();

      if (onSuccessAction) {
        onSuccessAction();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立任務模板失敗');
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
          任務名稱
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="任務名稱"
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
          placeholder="描述（可選）"
          disabled={isSubmitting}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          所屬工程模板
        </label>
        <div className="p-2 border rounded bg-gray-50">
          {engineeringTemplate.name}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancelAction}
          className="px-4 py-2 border rounded hover:bg-gray-100"
          disabled={isSubmitting}
        >
          取消
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? '建立中...' : '建立任務模板'}
        </button>
      </div>
    </form>
  );
}

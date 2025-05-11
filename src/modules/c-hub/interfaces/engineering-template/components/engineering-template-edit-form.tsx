'use client';

import { updateEngineeringTemplate } from '@/modules/c-hub/application/engineering-template/engineering-template-command';
import { EngineeringTemplate } from '@/modules/c-hub/domain/engineering-template';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface EngineeringTemplateEditFormProps {
  template: EngineeringTemplate;
  onCancelAction: () => void;
  onSuccessAction?: () => void;
}

export function EngineeringTemplateEditForm({
  template,
  onCancelAction,
  onSuccessAction
}: EngineeringTemplateEditFormProps) {
  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description || '');
  const [priority, setPriority] = useState<number>(template.priority ?? 0);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUpdating(true);

    if (!name.trim()) {
      setError('模板名稱不能為空');
      setIsUpdating(false);
      return;
    }

    try {
      await updateEngineeringTemplate(template.id, {
        name,
        description: description || null,
        priority
      });

      // 自動刷新：失效相關查詢緩存
      queryClient.invalidateQueries({ queryKey: ['engineeringTemplates'] });

      if (onSuccessAction) {
        onSuccessAction();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新工程模板失敗');
    } finally {
      setIsUpdating(false);
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
          模板名稱
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="模板名稱"
          required
          className="w-full p-2 border rounded"
          disabled={isUpdating}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          描述
        </label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="描述（可選）"
          className="w-full p-2 border rounded"
          disabled={isUpdating}
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium mb-1">
          優先順序
        </label>
        <input
          id="priority"
          type="number"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          placeholder="優先順序（數字，越小越高）"
          className="w-full p-2 border rounded"
          disabled={isUpdating}
          min={0}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancelAction}
          className="px-4 py-2 border rounded hover:bg-gray-100"
          disabled={isUpdating}
        >
          取消
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isUpdating}
        >
          {isUpdating ? '更新中...' : '更新'}
        </button>
      </div>
    </form>
  );
}

'use client';

import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { useState } from 'react';
import { useProjectTemplateUpdate } from '../hooks/project-template.update';

interface ProjectTemplateEditFormProps {
  template: ProjectTemplate;
  onCancelAction: () => void;  // 重命名為 onCancelAction
  onSuccessAction?: () => void;  // 重命名為 onSuccessAction
}

export function ProjectTemplateEditForm({
  template,
  onCancelAction,
  onSuccessAction
}: ProjectTemplateEditFormProps) {
  const [name, setName] = useState(template.name);
  const [description, setDescription] = useState(template.description || '');
  const [priority, setPriority] = useState<number>(template.priority ?? 0);
  const { updateTemplate, isUpdating, error } = useProjectTemplateUpdate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const success = await updateTemplate(template.id, {
        name,
        description: description || null,
        priority: Number(priority),
      });

      // 只負責 UI 狀態，不負責刷新
      if (success && onSuccessAction) {
        onSuccessAction();
      }
    } catch (error) {
      console.error('更新模板失敗:', error);
      alert('更新失敗，請稍後再試');
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
          優先順序 (數字越小優先度越高)
        </label>
        <input
          id="priority"
          type="number"
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
          className="w-full p-2 border rounded"
          min="0"
          max="9"
          placeholder="0"
          disabled={isUpdating}
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

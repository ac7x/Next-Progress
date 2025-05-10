'use client';

/**
 * 任務模板列表元件
 * 功能：展示任務模板清單，支援刪除操作
 * 使用方式：
 * <TaskTemplateList templates={templates} onDelete={refetchFn} />
 */

import { deleteTaskTemplateCommand } from '@/modules/c-hub/application/task-template/task-template.command';
import { TaskTemplate } from '@/modules/c-hub/domain/task-template';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface TaskTemplateListProps {
  templates: TaskTemplate[];
  onDelete?: () => void;
}

// 調整元件名稱與 props
export function TaskTemplateList({ templates, onDelete }: TaskTemplateListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!id || isDeleting) return;

    if (!confirm('確定要刪除此任務模板嗎？此操作無法恢復。')) {
      return;
    }

    setIsDeleting(id);
    setError(null);

    try {
      await deleteTaskTemplateCommand(id);
      onDelete?.();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除任務模板失敗');
      console.error('Failed to delete task template:', err);
    } finally {
      setIsDeleting(null);
    }
  };

  if (templates.length === 0) {
    return <p className="text-gray-500">目前沒有任務模板</p>;
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-2 text-red-600 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {templates.map((template) => (
          <div key={template.id} className="p-3 border rounded-lg bg-gray-50">
            <h4 className="font-medium">{template.name}</h4>

            {template.description && (
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
            )}

            <div className="mt-2 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                優先級: {template.priority === 0 ? '高' : template.priority === 1 ? '中' : '低'}
              </div>
              <button
                onClick={() => handleDelete(template.id)}
                disabled={isDeleting === template.id}
                className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
              >
                {isDeleting === template.id ? '刪除中...' : '刪除'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

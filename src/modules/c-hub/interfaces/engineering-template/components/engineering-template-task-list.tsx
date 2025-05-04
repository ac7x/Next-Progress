'use client';

import { deleteTaskTemplate } from '@/modules/c-hub/application/task-template/task-template-actions';
import { TaskTemplate } from '@/modules/c-hub/domain/task-template/task-template-entity';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface EngineeringTemplateTaskListProps {
  tasks: TaskTemplate[];
  onTaskDeleted?: () => void;
}

export function EngineeringTemplateTaskList({
  tasks,
  onTaskDeleted
}: EngineeringTemplateTaskListProps) {
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
      await deleteTaskTemplate(id);
      if (onTaskDeleted) {
        onTaskDeleted();
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除任務模板失敗');
      console.error('Failed to delete task template:', err);
    } finally {
      setIsDeleting(null);
    }
  };

  if (tasks.length === 0) {
    return <p className="text-gray-500 text-sm italic">尚無任務模板</p>;
  }

  return (
    <div className="mt-4">
      {error && (
        <div className="mb-4 p-2 text-red-600 bg-red-50 rounded border border-red-200 text-xs">
          {error}
        </div>
      )}

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="p-2 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
            <div>
              <p className="font-medium text-sm">{task.name}</p>
              {task.description && <p className="text-xs text-gray-600">{task.description}</p>}
            </div>
            <button
              onClick={() => handleDelete(task.id)}
              disabled={isDeleting === task.id}
              className="text-red-600 hover:text-red-800 text-xs disabled:opacity-50"
            >
              {isDeleting === task.id ? '刪除中...' : '刪除'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

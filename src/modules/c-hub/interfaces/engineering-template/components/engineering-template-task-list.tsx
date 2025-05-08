'use client';

import { deleteTaskTemplate, updateTaskTemplate } from '@/modules/c-hub/application/task-template/task-template-actions';
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
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
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

  const handleEditClick = (task: TaskTemplate) => {
    setEditingTaskId(task.id);
    setEditName(task.name);
    setEditDescription(task.description || '');
    setError(null);
  };

  const handleEditCancel = () => {
    setEditingTaskId(null);
    setEditName('');
    setEditDescription('');
    setError(null);
  };

  const handleEditSave = async (taskId: string) => {
    setIsUpdating(true);
    setError(null);
    try {
      await updateTaskTemplate(taskId, {
        name: editName,
        description: editDescription
      });
      setEditingTaskId(null);
      setEditName('');
      setEditDescription('');
      if (onTaskDeleted) onTaskDeleted();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新任務模板失敗');
    } finally {
      setIsUpdating(false);
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
            {editingTaskId === task.id ? (
              <form
                className="flex-1 flex flex-col gap-1"
                onSubmit={e => {
                  e.preventDefault();
                  handleEditSave(task.id);
                }}
              >
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="p-1 border rounded text-sm"
                  disabled={isUpdating}
                  required
                  placeholder="任務名稱"
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="p-1 border rounded text-xs"
                  disabled={isUpdating}
                  placeholder="描述（可選）"
                />
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="text-gray-500 hover:text-gray-700 text-xs px-2 py-1 border rounded"
                    disabled={isUpdating}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border rounded"
                    disabled={isUpdating}
                  >
                    儲存
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <p className="font-medium text-sm">{task.name}</p>
                  {task.description && <p className="text-xs text-gray-600">{task.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(task)}
                    className="text-blue-600 hover:text-blue-800 text-xs"
                    disabled={isDeleting === task.id}
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    disabled={isDeleting === task.id}
                    className="text-red-600 hover:text-red-800 text-xs disabled:opacity-50"
                  >
                    {isDeleting === task.id ? '刪除中...' : '刪除'}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

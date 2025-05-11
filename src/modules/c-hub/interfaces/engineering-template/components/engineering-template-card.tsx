'use client';

import { deleteEngineeringTemplate } from '@/modules/c-hub/application/engineering-template/engineering-template-command';
import { listTaskTemplatesByEngineeringId } from '@/modules/c-hub/application/task-template/task-template-actions';
import { EngineeringTemplate } from '@/modules/c-hub/domain/engineering-template';
import { ProjectInstance } from '@/modules/c-hub/domain/project-instance/entities/project-instance-entity';
import { TaskTemplate } from '@/modules/c-hub/domain/task-template';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { EngineeringTemplateAddTaskForm } from './engineering-template-add-task-form';
import { EngineeringTemplateEditForm } from './engineering-template-edit-form';
import { EngineeringTemplateInsertButton } from './engineering-template-insert-button';
import { EngineeringTemplateTaskList } from './engineering-template-task-list';

interface EngineeringTemplateCardProps {
  template: EngineeringTemplate;
  projects?: ProjectInstance[];
}

// 調整元件名稱與 props
export function EngineeringTemplateCard({ template, projects = [] }: EngineeringTemplateCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [tasks, setTasks] = useState<TaskTemplate[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleEditClick = () => {
    setIsEditing(true);
    setIsAddingTask(false);
  };

  const handleAddTaskClick = () => {
    setIsAddingTask(true);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleCancelAddTask = () => {
    setIsAddingTask(false);
  };

  const handleUpdateSuccess = () => {
    setIsEditing(false);
  };

  const handleAddTaskSuccess = () => {
    setIsAddingTask(false);
    loadTasks();
  };

  const handleToggleTasks = () => {
    if (!showTasks) {
      loadTasks();
    }
    setShowTasks(!showTasks);
  };

  const loadTasks = async () => {
    setIsLoadingTasks(true);
    try {
      const templateTasks = await listTaskTemplatesByEngineeringId(template.id);
      setTasks(templateTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('確定要刪除此工程模板嗎？此操作無法恢復。')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteEngineeringTemplate(template.id);
      // 自動刷新：失效相關查詢緩存
      queryClient.invalidateQueries({ queryKey: ['engineeringTemplates'] });
      // 使用 router.replace 而不是 refresh，更新 URL 但不刷新整個頁面
      router.replace('/client/template');
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除失敗');
      console.error('Failed to delete template:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">編輯工程模板</h3>
        <EngineeringTemplateEditForm
          template={template}
          onCancelAction={handleCancelEdit}
          onSuccessAction={handleUpdateSuccess}
        />
      </div>
    );
  }

  if (isAddingTask) {
    return (
      <div className="border p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">新增任務模板</h3>
        <EngineeringTemplateAddTaskForm
          engineeringTemplate={template}
          onCancelAction={handleCancelAddTask}
          onSuccessAction={handleAddTaskSuccess}
        />
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-lg relative pt-8">
      {error && (
        <div className="absolute top-0 left-0 right-0 p-2 text-red-600 bg-red-50 border-b border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between items-start absolute top-2 right-2 left-4">
        <div className="flex items-center">
          <EngineeringTemplateInsertButton
            template={template}
            projects={projects}
            className="mr-2 bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
          />
          <h3 className="text-xl font-semibold">{template.name}</h3>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleAddTaskClick}
            className="text-green-500 hover:text-green-700 text-sm"
          >
            新增任務
          </button>
          <button
            onClick={handleEditClick}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            編輯
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-800 text-sm disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? '刪除中...' : '刪除'}
          </button>
        </div>
      </div>

      {template.description && (
        <p className="text-gray-600 mt-6 mb-2 text-sm">{template.description}</p>
      )}

      <div className="mt-2 text-xs text-gray-500">
        <p>建立時間：{new Date(template.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="mt-4 pt-2 border-t">
        <button
          onClick={handleToggleTasks}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
        >
          <span>{showTasks ? '收起任務列表' : '查看任務列表'}</span>
          <span className="ml-1">{showTasks ? '▲' : '▼'}</span>
        </button>

        {showTasks && (
          <div className="mt-2">
            {isLoadingTasks ? (
              <p className="text-gray-500 text-sm">載入任務中...</p>
            ) : (
              <EngineeringTemplateTaskList
                tasks={tasks}
                onTaskDeleted={loadTasks}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

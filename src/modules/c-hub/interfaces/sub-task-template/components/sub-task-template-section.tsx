'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useQuerySubTaskTemplatesByTaskTemplate } from '../hooks/use-sub-task-templates-by-task-template';
import { SubTaskTemplateForm } from './sub-task-template-form';
import { SubTaskTemplateList } from './sub-task-template-list';

interface SubTaskTemplateSectionProps {
  taskTemplateId: string;
}

// 調整元件名稱與 props
export function SubTaskTemplateSection({ taskTemplateId }: SubTaskTemplateSectionProps) {
  const queryClient = useQueryClient();
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);

  const { data: templates = [], isLoading, error } = useQuerySubTaskTemplatesByTaskTemplate(taskTemplateId);

  const handleAddSuccess = () => {
    setIsAddingTemplate(false);
    queryClient.invalidateQueries({ queryKey: ['subTaskTemplates', taskTemplateId] });
  };

  const handleDelete = () => {
    queryClient.invalidateQueries({ queryKey: ['subTaskTemplates', taskTemplateId] });
  };

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">子任務模板</h3>
        <button
          onClick={() => setIsAddingTemplate(true)}
          className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          disabled={isAddingTemplate}
        >
          新增子任務模板
        </button>
      </div>

      {isAddingTemplate && (
        <div className="p-4 bg-gray-50 rounded border">
          <h4 className="font-medium mb-3">新增子任務模板</h4>
          <SubTaskTemplateForm
            taskTemplateId={taskTemplateId}
            onSuccess={handleAddSuccess}
            onCancel={() => setIsAddingTemplate(false)}
          />
        </div>
      )}

      {error && (
        <div className="p-2 text-red-600 bg-red-50 rounded border border-red-200">
          {(error as Error).message}
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-500">載入子任務模板中...</p>
      ) : (
        <SubTaskTemplateList templates={templates} onDelete={handleDelete} />
      )}
    </div>
  );
}

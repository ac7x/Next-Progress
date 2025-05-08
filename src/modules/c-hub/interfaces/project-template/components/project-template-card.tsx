'use client';

import { deleteProjectTemplateCommand } from '@/modules/c-hub/application/project-template/project-template-actions';
import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ProjectTemplateCreateButton } from './project-template-create-button';
import { ProjectTemplateEditForm } from './project-template-edit-form';

interface ProjectTemplateCardProps {
  template: ProjectTemplate;
  onDelete?: () => void;
}

export function ProjectTemplateCard({ template, onDelete }: ProjectTemplateCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateSuccess = () => {
    setIsEditing(false);
  };

  const handleDeleteClick = async () => {
    if (!confirm(`確定要刪除「${template.name}」模板嗎？此操作無法復原。`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteProjectTemplateCommand(template.id);
      if (onDelete) {
        onDelete();
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除模板失敗');
      console.error('刪除專案模板失敗:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderCreateButton = () => (
    <div className="mt-4 flex justify-end">
      <ProjectTemplateCreateButton template={template} />
    </div>
  );

  if (isEditing) {
    return (
      <div className="border p-4 rounded-lg bg-white shadow-md mb-6 max-w-full">
        <h3 className="text-lg font-medium mb-3">編輯專案模板</h3>
        <ProjectTemplateEditForm
          template={template}
          onCancelAction={handleCancelEdit}
          onSuccessAction={handleUpdateSuccess}
        />
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-lg bg-white shadow-sm hover:shadow transition-shadow flex flex-col h-full relative mb-6 max-w-full">
      {/* 優先級 badge 右上角顯示，僅顯示數字 */}
      <span className="absolute top-3 right-4 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-medium z-10">
        {template.priority}
      </span>

      <h3 className="text-xl font-semibold leading-tight mb-2 pr-20 break-words">{template.name}</h3>
      {template.description && (
        <p className="text-gray-600 mb-2 text-sm break-words">{template.description}</p>
      )}
      <div className="text-xs text-gray-500 mb-2">建立時間：{new Date(template.createdAt).toLocaleDateString()}</div>

      <div className="flex-1" />

      {/* 操作區固定底部，三個按鈕分散排列，避免重疊 */}
      <div className="flex flex-row items-end mt-4 gap-2">
        <button
          onClick={handleEditClick}
          className="text-blue-500 hover:text-blue-700 text-sm px-2 py-1 border border-blue-100 rounded disabled:opacity-50"
          disabled={isDeleting}
        >
          編輯
        </button>
        <button
          onClick={handleDeleteClick}
          className="text-red-500 hover:text-red-700 text-sm px-2 py-1 border border-red-100 rounded disabled:opacity-50"
          disabled={isDeleting}
        >
          {isDeleting ? '刪除中...' : '刪除'}
        </button>
        <div className="ml-auto">
          <ProjectTemplateCreateButton template={template} />
        </div>
      </div>
      {error && (
        <div className="mt-2 text-red-600 text-xs">{error}</div>
      )}
    </div>
  );
}

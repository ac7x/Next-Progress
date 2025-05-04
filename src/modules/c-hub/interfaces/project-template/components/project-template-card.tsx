'use client';

import { deleteProjectTemplate } from '@/modules/c-hub/application/project-template/project-template-actions';
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
      await deleteProjectTemplate(template.id);
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
      <div className="border p-4 rounded-lg">
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
    <div className="border p-4 rounded-lg relative pt-8">
      {error && (
        <div className="absolute top-0 left-0 right-0 p-2 text-red-600 bg-red-50 border-b border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between items-start absolute top-2 right-2 left-4">
        <h3 className="text-xl font-semibold">{template.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={handleEditClick}
            className="text-blue-500 hover:text-blue-700"
            disabled={isDeleting}
          >
            編輯
          </button>
          <button
            onClick={handleDeleteClick}
            className="text-red-500 hover:text-red-700 ml-2"
            disabled={isDeleting}
          >
            {isDeleting ? '刪除中...' : '刪除'}
          </button>
        </div>
      </div>

      {template.description && (
        <p className="text-gray-600 mt-6 mb-2">{template.description}</p>
      )}

      {renderCreateButton()}
    </div>
  );
}

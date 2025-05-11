'use client';

import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/entities/project-template-entity';
import { useProjectFromTemplateCreation } from '../hooks/use-project-from-template-creation';
import { ProjectTemplateFormFields } from './project-template-form-fields';

interface ProjectTemplateCreateModalProps {
  template: ProjectTemplate;
  onCloseAction: () => void;
  currentUserId: string;
}

export function ProjectTemplateCreateModal({ template, onCloseAction, currentUserId }: ProjectTemplateCreateModalProps) {
  const {
    formState,
    handleNameChange,
    handleDescriptionChange,
    handleCreateFromTemplate,
    isCreating,
    error,
    success
  } = useProjectFromTemplateCreation(template, onCloseAction, currentUserId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">從模板建立專案</h3>
          <button
            onClick={onCloseAction}
            className="text-gray-500 hover:text-gray-700"
            disabled={isCreating}
            aria-label="關閉對話框"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="p-4 bg-green-50 text-green-700 rounded-md mb-4">
            專案創建成功！即將跳轉至專案管理頁面...
          </div>
        ) : (
          <form onSubmit={handleCreateFromTemplate} className="space-y-4">
            {error && (
              <div className="p-2 text-red-600 bg-red-50 rounded border border-red-200">
                {error}
              </div>
            )}

            <ProjectTemplateFormFields
              formState={formState}
              onNameChangeAction={handleNameChange}
              onDescriptionChangeAction={handleDescriptionChange}
              disabled={isCreating}
            />

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={onCloseAction}
                className="px-4 py-2 border rounded bg-gray-100"
                disabled={isCreating}
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isCreating}
              >
                {isCreating ? '建立中...' : '建立'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

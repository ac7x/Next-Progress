'use client';

import { ProjectTemplateFormState } from '../hooks/use-project-from-template-creation';

interface ProjectTemplateFormFieldsProps {
  formState: ProjectTemplateFormState;
  onNameChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChangeAction: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

export function ProjectTemplateFormFields({
  formState,
  onNameChangeAction,
  onDescriptionChangeAction,
  disabled
}: ProjectTemplateFormFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
          專案名稱
        </label>
        <input
          id="projectName"
          type="text"
          value={formState.name}
          onChange={onNameChangeAction}
          className="w-full p-2 border rounded"
          required
          disabled={disabled}
        />
      </div>

      <div>
        <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">
          描述 (選填)
        </label>
        <textarea
          id="projectDescription"
          value={formState.description}
          onChange={onDescriptionChangeAction}
          className="w-full p-2 border rounded"
          rows={3}
          disabled={disabled}
        />
      </div>
    </>
  );
}

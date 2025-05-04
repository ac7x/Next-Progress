'use client';

import { ProjectTemplateFormState } from '../hooks/use-project-from-template-creation';

interface ProjectTemplateFormFieldsProps {
  formState: ProjectTemplateFormState;
  onNameChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChangeAction: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPriorityChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void; // 添加 priority 處理器
  onStartDateChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}

export function ProjectTemplateFormFields({
  formState,
  onNameChangeAction,
  onDescriptionChangeAction,
  onPriorityChangeAction, // 添加 priority 處理器
  onStartDateChangeAction,
  onEndDateChangeAction,
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
        ></textarea>
      </div>
      
      {/* 添加優先順序欄位 */}
      <div>
        <label htmlFor="projectPriority" className="block text-sm font-medium text-gray-700 mb-1">
          優先順序 (數字越小優先度越高)
        </label>
        <input
          type="number"
          id="projectPriority"
          value={formState.priority}
          onChange={onPriorityChangeAction}
          className="w-full p-2 border rounded"
          min="0"
          placeholder="0"
          disabled={disabled}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="projectStartDate" className="block text-sm font-medium text-gray-700 mb-1">
            開始日期 (選填)
          </label>
          <input
            type="date"
            id="projectStartDate"
            value={formState.startDate}
            onChange={onStartDateChangeAction}
            className="w-full p-2 border rounded"
            disabled={disabled}
          />
        </div>
        
        <div>
          <label htmlFor="projectEndDate" className="block text-sm font-medium text-gray-700 mb-1">
            結束日期 (選填)
          </label>
          <input
            type="date"
            id="projectEndDate"
            value={formState.endDate}
            min={formState.startDate}
            onChange={onEndDateChangeAction}
            className="w-full p-2 border rounded"
            disabled={disabled || !formState.startDate}
          />
        </div>
      </div>
    </>
  );
}

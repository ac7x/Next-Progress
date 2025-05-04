'use client';

import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { ProjectFormState } from '../hooks/use-project-instance-creation';

interface ProjectFormFieldsProps {
  formState: ProjectFormState;
  onNameChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChangeAction: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTemplateChangeAction: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPriorityChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void; // 添加 priority 處理器
  onStartDateChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChangeAction: (e: React.ChangeEvent<HTMLInputElement>) => void;
  templates: ProjectTemplate[];
  disabled: boolean;
}

export function ProjectFormFields({
  formState,
  onNameChangeAction,
  onDescriptionChangeAction,
  onTemplateChangeAction,
  onPriorityChangeAction, // 添加 priority 處理器
  onStartDateChangeAction,
  onEndDateChangeAction,
  templates,
  disabled
}: ProjectFormFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
          專案名稱
        </label>
        <input
          type="text"
          id="projectName"
          value={formState.name}
          onChange={onNameChangeAction}
          className="w-full p-2 border rounded"
          required
          disabled={disabled}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          描述 (選填)
        </label>
        <textarea
          id="description"
          value={formState.description}
          onChange={onDescriptionChangeAction}
          className="w-full p-2 border rounded"
          rows={3}
          disabled={disabled}
        ></textarea>
      </div>

      {/* 添加優先順序欄位 */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          優先順序 (數字越小優先度越高)
        </label>
        <input
          type="number"
          id="priority"
          value={formState.priority}
          onChange={onPriorityChangeAction}
          className="w-full p-2 border rounded"
          min="0"
          placeholder="0"
          disabled={disabled}
        />
      </div>

      <div>
        <label htmlFor="templateId" className="block text-sm font-medium text-gray-700 mb-1">
          專案模板
        </label>
        <select
          id="templateId"
          value={formState.templateId}
          onChange={onTemplateChangeAction}
          className="w-full p-2 border rounded"
          disabled={disabled || templates.length === 0}
        >
          <option value="">不使用模板</option>
          {templates.map(template => (
            <option key={template.id} value={template.id}>{template.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
            開始日期 (選填)
          </label>
          <input
            type="date"
            id="startDate"
            value={formState.startDate}
            onChange={onStartDateChangeAction}
            className="w-full p-2 border rounded"
            disabled={disabled}
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
            結束日期 (選填)
          </label>
          <input
            type="date"
            id="endDate"
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

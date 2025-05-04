'use client';

import { useProjectCreation } from '../hooks/use-project-instance-creation';
import { ProjectFormFields } from './project-instance-form-fields';

export function ProjectForm() {
  const {
    formState,
    handleInputChange,
    handleTemplateChange,
    handlePriorityChange, // 新增 handlePriorityChange
    handleStartDateChange,
    handleEndDateChange,
    handleSubmit,
    isLoading,
    error,
    success,
    templates
  } = useProjectCreation();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2 text-red-600 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="p-2 text-green-600 bg-green-50 rounded border border-green-200">
          專案創建成功！即將前往專案管理頁面...
        </div>
      )}

      <ProjectFormFields
        formState={formState}
        onNameChangeAction={(e) => handleInputChange('name')(e)}
        onDescriptionChangeAction={(e) => handleInputChange('description')(e)}
        onTemplateChangeAction={handleTemplateChange}
        onPriorityChangeAction={handlePriorityChange} // 添加 priority 處理器
        onStartDateChangeAction={handleStartDateChange}
        onEndDateChangeAction={handleEndDateChange}
        templates={templates}
        disabled={isLoading || success}
      />

      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        disabled={isLoading || success}
      >
        {isLoading ? '建立中...' : '建立專案'}
      </button>
    </form>
  );
}

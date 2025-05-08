'use client';

import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { useState } from 'react';
import { ProjectTemplateCreateModal } from './project-template-create-modal';

interface ProjectTemplateCreateButtonProps {
  template: ProjectTemplate;
  currentUserId?: string; // 新增
}

export function ProjectTemplateCreateButton({ template, currentUserId = 'system' }: ProjectTemplateCreateButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        aria-label={`使用 ${template.name} 模板建立專案`}
      >
        建立
      </button>

      {isModalOpen && (
        <ProjectTemplateCreateModal
          template={template}
          onCloseAction={handleCloseModal}
          currentUserId={currentUserId} // 傳遞
        />
      )}
    </>
  );
}

export default ProjectTemplateCreateButton;

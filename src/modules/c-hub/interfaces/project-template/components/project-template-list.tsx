'use client';

import { useProjectTemplateQuery } from '../hooks/project-template.query';
import { ProjectTemplateCard } from './project-template-card';

interface ProjectTemplateListProps {
  onDelete?: () => void;
}

export function ProjectTemplateList({ onDelete }: ProjectTemplateListProps) {
  const { data: templates, isLoading, error } = useProjectTemplateQuery();

  if (isLoading) {
    return <p className="text-gray-500">載入專案模板中...</p>;
  }

  if (error) {
    return <p className="text-red-500">載入專案模板失敗</p>;
  }

  if (!Array.isArray(templates) || templates.length === 0) {
    return <p className="text-gray-500">目前沒有專案模板</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <ProjectTemplateCard
            key={template.id}
            template={template}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectTemplateList;

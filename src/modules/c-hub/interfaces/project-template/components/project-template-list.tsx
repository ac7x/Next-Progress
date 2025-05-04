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

  // 型別守衛，確保 templates 為陣列
  if (!Array.isArray(templates) || templates.length === 0) {
    return <p className="text-gray-500">目前沒有專案模板</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) =>
          template && template.id ? (
            <ProjectTemplateCard
              key={template.id}
              template={template}
              onDelete={onDelete}
            />
          ) : null
        )}
      </div>
    </div>
  );
}

export default ProjectTemplateList;

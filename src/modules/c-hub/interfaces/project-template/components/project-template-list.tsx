'use client';

import { useProjectTemplatesQuery } from '../hooks/use-project-templates-query';
import { ProjectTemplateCard } from './project-template-card';

interface ProjectTemplateListProps {
  onDelete?: () => void;
}

export function ProjectTemplateList({ onDelete }: ProjectTemplateListProps) {
  const { data: templates } = useProjectTemplatesQuery();

  if (!templates || templates.length === 0) {
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

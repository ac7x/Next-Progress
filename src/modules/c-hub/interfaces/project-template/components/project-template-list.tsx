'use client';

import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { ProjectTemplateCard } from './project-template-card';

interface ProjectTemplateListProps {
  templates: ProjectTemplate[];
  onDelete?: () => void;
}

export function ProjectTemplateList({ templates, onDelete }: ProjectTemplateListProps) {
  // 型別守衛，確保 templates 為陣列且每個元素有 id
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

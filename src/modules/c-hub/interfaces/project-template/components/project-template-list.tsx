'use client';

import { ProjectTemplate } from '@/modules/c-hub/domain/project-template/entities/project-template-entity';
import { ProjectTemplateCard } from './project-template-card';

interface ProjectTemplateListProps {
  templates: ProjectTemplate[];
  onDelete?: () => void;
}

export function ProjectTemplateList({ templates, onDelete }: ProjectTemplateListProps) {
  // 型別守衛，確保 templates 為陣列且每個元素有 id
  if (!Array.isArray(templates) || templates.length === 0) {
    return (
      <div className="mt-4 p-2 bg-yellow-50 text-yellow-700 rounded border border-yellow-200 text-center">
        尚無可用專案模板，請先建立一個。
      </div>
    );
  }

  // 依 priority 數字升冪排序（數字越小優先度越高）
  const sortedTemplates = [...templates].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {sortedTemplates.map((template) =>
          template && template.id ? (
            <div key={template.id} className="h-full flex">
              <ProjectTemplateCard
                template={template}
                onDelete={onDelete}
              />
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export default ProjectTemplateList;

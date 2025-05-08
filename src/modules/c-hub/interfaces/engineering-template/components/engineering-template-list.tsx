'use client';

import { ProjectInstance } from '@/modules/c-hub/domain/project-instance/project-instance-entity';
import { useEngineeringTemplatesQuery } from '../hooks/use-engineering-templates-query';
import { EngineeringTemplateCard } from './engineering-template-card';

interface EngineeringTemplateListProps {
  projects?: ProjectInstance[];
}

export function EngineeringTemplateList({ projects = [] }: EngineeringTemplateListProps) {
  const { data: templates, isLoading, error } = useEngineeringTemplatesQuery();

  if (isLoading) {
    return <p className="text-gray-500">載入工程模板中...</p>;
  }

  if (error) {
    return <p className="text-red-500">工程模板載入失敗</p>;
  }

  const validTemplates = templates ?? [];

  if (validTemplates.length === 0) {
    return <p className="text-gray-500">目前沒有工程模板</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {validTemplates.map((template) => (
        <EngineeringTemplateCard
          key={template.id}
          template={template}
          projects={projects} // 修正：確保傳遞完整專案清單
        />
      ))}
    </div>
  );
}

'use client';

import { createProjectTemplateCommand } from '@/modules/c-hub/application/project-template/project-template-actions';
import { CreateProjectTemplateProps } from '@/modules/c-hub/domain/project-template/entities/project-template-entity';
import { useState } from 'react';

// CQRS: Command Hook，專責建立
export function useProjectTemplateCreate() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTemplate = async (data: CreateProjectTemplateProps) => {
    setIsCreating(true);
    setError(null);

    try {
      await createProjectTemplateCommand(data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '建立專案模板失敗');
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return { createTemplate, isCreating, error };
}

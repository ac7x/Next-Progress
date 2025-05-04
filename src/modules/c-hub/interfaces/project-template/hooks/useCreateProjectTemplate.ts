'use client';

import { createProjectTemplate } from '@/modules/c-hub/application/project-template/project-template-actions';
import { CreateProjectTemplateProps } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useCreateProjectTemplate() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const createTemplate = async (data: CreateProjectTemplateProps) => {
    setIsCreating(true);
    setError(null);

    try {
      await createProjectTemplate(data);
      router.refresh();
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

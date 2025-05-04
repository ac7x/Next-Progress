'use client';

import { updateEngineeringTemplate } from '@/modules/c-hub/application/engineering-template/engineering-template-actions';
import { UpdateEngineeringTemplateProps } from '@/modules/c-hub/domain/engineering-template/engineering-template-entity';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useUpdateEngineeringTemplate() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const updateTemplate = async (
    id: string,
    data: UpdateEngineeringTemplateProps
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      await updateEngineeringTemplate(id, data);
      router.refresh();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新工程模板失敗';
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateTemplate, isUpdating, error };
}

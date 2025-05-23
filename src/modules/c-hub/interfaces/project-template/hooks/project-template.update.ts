'use client';

import { updateProjectTemplateCommand } from '@/modules/c-hub/application/project-template/project-template-actions';
import { CreateProjectTemplateProps } from '@/modules/c-hub/domain/project-template/entities/project-template-entity';
import { useState } from 'react';

// CQRS: Command Hook，專責更新
export function useProjectTemplateUpdate() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateTemplate = async (
        id: string,
        data: Partial<CreateProjectTemplateProps>
    ) => {
        setIsUpdating(true);
        setError(null);

        try {
            await updateProjectTemplateCommand(id, data);
            return true;
        } catch (err) {
            setError(err instanceof Error ? err.message : '更新專案模板失敗');
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateTemplate, isUpdating, error };
}

'use client';

import { CreateProjectTemplateProps } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateProjectTemplateHandler } from '../project-template.controller';

// CQRS: Command Controller Hook，僅負責更新
// 只負責更新專案模板
export function useProjectTemplateUpdate() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const updateTemplate = async (
        id: string,
        data: Partial<CreateProjectTemplateProps>
    ) => {
        setIsUpdating(true);
        setError(null);

        try {
            await updateProjectTemplateHandler(id, data);
            router.refresh();
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

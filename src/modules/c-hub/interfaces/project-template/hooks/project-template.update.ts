'use client';

import { CreateProjectTemplateProps } from '@/modules/c-hub/domain/project-template/project-template-entity';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateProjectTemplateHandler } from '../project-template.controller';

// CQRS: Command Hook，只負責更新
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
            // 移除 router.refresh，SRP: 只負責命令
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

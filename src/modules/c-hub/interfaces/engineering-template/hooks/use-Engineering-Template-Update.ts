'use client';

import { updateEngineeringTemplate } from '@/modules/c-hub/application/engineering-template/engineering-template-command';
import { UpdateEngineeringTemplateProps } from '@/modules/c-hub/domain/engineering-template';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// Command hook，僅負責資料變更
export function useUpdateEngineeringTemplate() {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEngineeringTemplateProps }) => {
      return await updateEngineeringTemplate(id, data);
    },
    onSuccess: () => {
      // 自動刷新：失效相關查詢緩存
      queryClient.invalidateQueries({ queryKey: ['engineeringTemplates'] });
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : '更新工程模板失敗';
      setError(errorMessage);
    }
  });

  const updateTemplate = async (
    id: string,
    data: UpdateEngineeringTemplateProps
  ) => {
    setError(null);

    try {
      await mutation.mutateAsync({ id, data });
      return true;
    } catch (err) {
      // 錯誤處理已在 mutation.onError 中進行
      return false;
    }
  };

  return {
    updateTemplate,
    isUpdating: mutation.isPending,
    error,
    isSuccess: mutation.isSuccess
  };
}

'use client';

import { updateSubTaskInstanceCommand } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance-command';
import { UpdateSubTaskInstanceProps } from '@/modules/c-hub/domain/sub-task-instance';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

/**
 * 子任務更新鉤子函數
 * 負責處理子任務的前端更新邏輯，包括樂觀更新和錯誤處理
 */
export function useSubTaskInstanceUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // 通用更新方法，支援所有欄位
  const updateSubTaskInstance = async (id: string, data: UpdateSubTaskInstanceProps): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);

      const updatedSubTask = await updateSubTaskInstanceCommand(id, data);

      // 優化：觸發 React Query 緩存更新
      queryClient.invalidateQueries({ queryKey: ['subTaskInstances'] });

      return true;
    } catch (err) {
      console.error('更新子任務失敗:', err);
      setError(err instanceof Error ? err.message : '更新子任務失敗');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // 方便的單欄位更新方法
  const updateSubTaskInstanceField = async <K extends keyof UpdateSubTaskInstanceProps>(
    id: string,
    field: K,
    value: UpdateSubTaskInstanceProps[K]
  ): Promise<boolean> => {
    try {
      setIsUpdating(true);
      setError(null);

      await updateSubTaskInstanceCommand(id, { [field]: value } as UpdateSubTaskInstanceProps);

      // 優化：觸發 React Query 緩存更新
      queryClient.invalidateQueries({ queryKey: ['subTaskInstances'] });

      return true;
    } catch (err) {
      console.error(`更新子任務欄位 ${String(field)} 失敗:`, err);
      setError(err instanceof Error ? err.message : '更新子任務失敗');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateSubTaskInstance, updateSubTaskInstanceField, isUpdating, error };
}

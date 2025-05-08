'use client';

import { updateSubTaskInstanceCommand } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance.command';
import { UpdateSubTaskInstanceProps } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// 只負責命令，狀態同步交由 Server
export function useSubTaskInstanceUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const updateSubTaskInstanceField = async (
    id: string,
    fieldName: keyof UpdateSubTaskInstanceProps,
    value: any
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      const updateData: UpdateSubTaskInstanceProps = {
        [fieldName]: value
      };
      const updated = await updateSubTaskInstanceCommand(id, updateData);
      // 命令成功後 invalidate cache，觸發子任務列表刷新
      await queryClient.invalidateQueries({ queryKey: ['subTaskInstances', updated.taskId] });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新子任務失敗');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateSubTaskInstanceField, isUpdating, error };
}

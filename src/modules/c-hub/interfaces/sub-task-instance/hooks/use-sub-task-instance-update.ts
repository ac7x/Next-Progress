'use client';

import { updateSubTaskInstance } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance-actions';
import { SubTaskInstanceStatus, UpdateSubTaskInstanceProps } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { useState } from 'react';

export function useSubTaskInstanceUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSubTaskInstanceField = async (
    id: string,
    fieldName: keyof UpdateSubTaskInstanceProps,
    value: any
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      // 構建更新對象
      const updateData: UpdateSubTaskInstanceProps = {
        [fieldName]: value
      };

      // 如果更新狀態為完成，也將完成率設為 100%
      if (fieldName === 'status' && value === 'DONE') {
        updateData.completionRate = 100;
      }

      // 如果更新完成率為 100%，也將狀態設為完成
      if (fieldName === 'completionRate' && value === 100) {
        updateData.status = 'DONE' as SubTaskInstanceStatus;
      }

      await updateSubTaskInstance(id, updateData);
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

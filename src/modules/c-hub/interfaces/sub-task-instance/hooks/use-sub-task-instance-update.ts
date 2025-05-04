'use client';

import { updateSubTaskInstanceCommand } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance.command';
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
      const updateData: UpdateSubTaskInstanceProps = {
        [fieldName]: value
      };

      if (fieldName === 'status' && value === 'DONE') {
        updateData.completionRate = 100;
      }
      if (fieldName === 'completionRate' && value === 100) {
        updateData.status = 'DONE' as SubTaskInstanceStatus;
      }

      await updateSubTaskInstanceCommand(id, updateData);
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

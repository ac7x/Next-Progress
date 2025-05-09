'use client';

import { listEngineeringsByProject } from '@/modules/c-hub/application/engineering-instance/engineering-instance-actions';
import { listSubTasksInstanceByTaskId } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance-actions';
import { updateSubTaskInstanceCommand } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance.command';
import { listTaskInstancesByProject } from '@/modules/c-hub/application/task-instance/task-instance-actions';
import { updateTaskInstanceCommand } from '@/modules/c-hub/application/task-instance/task-instance.command';
import { EngineeringInstance } from '@/modules/c-hub/domain/engineering-instance/engineering-instance-entity';
import { ProjectInstance } from '@/modules/c-hub/domain/project-instance/entities/project-instance-entity';
import { SubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance';
import { TaskInstance } from '@/modules/c-hub/domain/task-instance/task-instance-entity';
import { useEffect, useState } from 'react';
import { ProjectInstanceBasicInfo } from './project-instance-basic-info';
import { ProjectInstanceEngineeringList } from './project-instance-engineering-list';
import { ProjectInstanceTaskInstanceList } from './project-instance-task-instance-list';
import { ProjectInstanceTaskOverviewSummary } from './project-instance-task-overview-summary';

interface ProjectInstanceDetailsProps {
  projectInstance: ProjectInstance;
}

export function ProjectInstanceDetails({ projectInstance }: ProjectInstanceDetailsProps) {
  const [engineeringInstances, setEngineeringInstances] = useState<EngineeringInstance[]>([]);
  const [taskInstances, setTaskInstances] = useState<TaskInstance[]>([]);
  const [subTaskInstancesMap, setSubTaskInstancesMap] = useState<Record<string, SubTaskInstance[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 新增狀態：追蹤每個任務/子任務的 loading 狀態與錯誤
  const [taskUpdating, setTaskUpdating] = useState<Record<string, boolean>>({});
  const [taskUpdateError, setTaskUpdateError] = useState<Record<string, string | null>>({});
  const [subTaskUpdating, setSubTaskUpdating] = useState<Record<string, boolean>>({});
  const [subTaskUpdateError, setSubTaskUpdateError] = useState<Record<string, string | null>>({});

  useEffect(() => {
    async function loadProjectInstanceDetails() {
      setIsLoading(true);
      try {
        const [engineeringData, taskInstanceData] = await Promise.all([
          listEngineeringsByProject(projectInstance.id),
          listTaskInstancesByProject(projectInstance.id)
        ]);
        setEngineeringInstances(engineeringData);
        setTaskInstances(taskInstanceData);

        // 查詢所有子任務（依據所有任務ID）
        const allTaskInstanceIds = taskInstanceData.map((t: TaskInstance) => t.id);
        const subTasksResult: Record<string, SubTaskInstance[]> = {};
        await Promise.all(
          allTaskInstanceIds.map(async (taskInstanceId: string) => {
            const subTaskInstances = await listSubTasksInstanceByTaskId(taskInstanceId);
            subTasksResult[taskInstanceId] = subTaskInstances;
          })
        );
        setSubTaskInstancesMap(subTasksResult);
      } catch (err) {
        setError(err instanceof Error ? err.message : '載入專案詳情失敗');
        console.error('載入專案詳情失敗:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjectInstanceDetails();
  }, [projectInstance.id]);

  // 處理任務 actualEquipmentCount 更新
  const handleTaskActualEquipmentCountChange = async (taskId: string, value: number) => {
    setTaskUpdating(prev => ({ ...prev, [taskId]: true }));
    setTaskUpdateError(prev => ({ ...prev, [taskId]: null }));
    try {
      await updateTaskInstanceCommand(taskId, { actualEquipmentCount: value });
      // 更新本地狀態
      setTaskInstances(prev =>
        prev.map(t => t.id === taskId ? { ...t, actualEquipmentCount: value } : t)
      );
    } catch (err) {
      setTaskUpdateError(prev => ({
        ...prev,
        [taskId]: err instanceof Error ? err.message : '更新失敗'
      }));
    } finally {
      setTaskUpdating(prev => ({ ...prev, [taskId]: false }));
    }
  };

  // 處理子任務 actualEquipmentCount 更新
  const handleSubTaskActualEquipmentCountChange = async (subTaskId: string, value: number, parentTaskId: string) => {
    setSubTaskUpdating(prev => ({ ...prev, [subTaskId]: true }));
    setSubTaskUpdateError(prev => ({ ...prev, [subTaskId]: null }));
    try {
      await updateSubTaskInstanceCommand(subTaskId, { actualEquipmentCount: value });
      // 更新本地狀態
      setSubTaskInstancesMap(prev => ({
        ...prev,
        [parentTaskId]: prev[parentTaskId].map(st =>
          st.id === subTaskId ? { ...st, actualEquipmentCount: value } : st
        )
      }));
    } catch (err) {
      setSubTaskUpdateError(prev => ({
        ...prev,
        [subTaskId]: err instanceof Error ? err.message : '更新失敗'
      }));
    } finally {
      setSubTaskUpdating(prev => ({ ...prev, [subTaskId]: false }));
    }
  };

  if (isLoading) {
    return <div className="py-4">載入中...</div>;
  }

  if (error) {
    return <div className="py-4 text-red-600">{error}</div>;
  }

  // 將任務按工程分組
  const taskInstancesByEngineering = taskInstances.reduce((acc: Record<string, TaskInstance[]>, taskInstance) => {
    const key = taskInstance.engineeringId || 'none';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(taskInstance);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">專案詳情</h3>
        <ProjectInstanceBasicInfo projectInstance={projectInstance} />
        <ProjectInstanceEngineeringList
          engineeringInstances={engineeringInstances}
          taskInstancesByEngineering={taskInstancesByEngineering}
          subTaskInstancesMap={subTaskInstancesMap}
          taskUpdating={taskUpdating}
          taskUpdateError={taskUpdateError}
          subTaskUpdating={subTaskUpdating}
          subTaskUpdateError={subTaskUpdateError}
          onTaskActualEquipmentCountChange={handleTaskActualEquipmentCountChange}
          onSubTaskActualEquipmentCountChange={handleSubTaskActualEquipmentCountChange}
        />
        <ProjectInstanceTaskInstanceList
          taskInstances={taskInstancesByEngineering['none'] || []}
          subTaskInstancesMap={subTaskInstancesMap}
          taskUpdating={taskUpdating}
          taskUpdateError={taskUpdateError}
          subTaskUpdating={subTaskUpdating}
          subTaskUpdateError={subTaskUpdateError}
          onTaskActualEquipmentCountChange={handleTaskActualEquipmentCountChange}
          onSubTaskActualEquipmentCountChange={handleSubTaskActualEquipmentCountChange}
        />
        <ProjectInstanceTaskOverviewSummary taskInstances={taskInstances} />
      </div>
    </div>
  );
}

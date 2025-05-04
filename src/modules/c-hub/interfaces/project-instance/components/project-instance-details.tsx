'use client';

import { listEngineeringsByProject } from '@/modules/c-hub/application/engineering-instance/engineering-instance-actions';
import { listSubTasksInstanceByTaskId } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance-actions';
import { listTaskInstancesByProject } from '@/modules/c-hub/application/task-instance/task-instance-actions';
import { ProjectInstance } from '@/modules/c-hub/domain/project-instance/project-instance-entity';
import { SubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { TaskInstance } from '@/modules/c-hub/domain/task-instance/task-instance-entity';
import { useEffect, useState } from 'react';

interface ProjectInstanceDetailsProps {
  projectInstance: ProjectInstance;
}

export function ProjectInstanceDetails({ projectInstance }: ProjectInstanceDetailsProps) {
  const [engineeringInstances, setEngineeringInstances] = useState<any[]>([]);
  const [taskInstances, setTaskInstances] = useState<TaskInstance[]>([]);
  const [subTaskInstancesMap, setSubTaskInstancesMap] = useState<Record<string, SubTaskInstance[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

        {/* 專案基本信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">建立者</p>
            <p>{projectInstance.createdBy || '未指定'}</p>
          </div>
          {/* 添加優先順序顯示 */}
          <div>
            <p className="text-sm text-gray-500">優先順序</p>
            <p>{projectInstance.priority !== null && projectInstance.priority !== undefined ? projectInstance.priority : '未設定'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">建立時間</p>
            <p>{new Date(projectInstance.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">最後更新</p>
            <p>{new Date(projectInstance.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        {/* 專案工程列表 */}
        <div className="mt-4 border-t pt-4">
          <h4 className="font-medium mb-2 text-lg">工程列表</h4>
          {engineeringInstances.length === 0 ? (
            <p className="text-gray-500">此專案尚無工程</p>
          ) : (
            <ul className="list-disc pl-5">
              {engineeringInstances.map(engineeringInstance => (
                <li key={engineeringInstance.id} className="mb-2">
                  <div className="font-medium">{engineeringInstance.name}</div>
                  {engineeringInstance.description && <div className="text-gray-600 text-sm">{engineeringInstance.description}</div>}

                  {/* 顯示此工程下的任務 */}
                  {taskInstancesByEngineering[engineeringInstance.id] && taskInstancesByEngineering[engineeringInstance.id].length > 0 && (
                    <div className="mt-1 ml-4">
                      <p className="text-sm text-gray-700 font-medium">相關任務:</p>
                      <div className="mt-2 space-y-2">
                        {taskInstancesByEngineering[engineeringInstance.id].map(taskInstance => (
                          <div key={taskInstance.id} className="border rounded p-2 bg-gray-50">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{taskInstance.name}</span>
                              <span className="text-xs text-gray-500">
                                設備數量: {taskInstance.equipmentCount ?? 0} / 完成: {taskInstance.actualEquipmentCount ?? 0}
                              </span>
                            </div>
                            {taskInstance.description && (
                              <div className="text-xs text-gray-600">{taskInstance.description}</div>
                            )}
                            {/* 子任務清單 */}
                            {subTaskInstancesMap[taskInstance.id] && subTaskInstancesMap[taskInstance.id].length > 0 && (
                              <div className="mt-2 ml-2">
                                <p className="text-xs text-gray-700 font-medium">子任務：</p>
                                <ul className="list-disc pl-5 space-y-1">
                                  {subTaskInstancesMap[taskInstance.id].map(subTaskInstance => (
                                    <li key={subTaskInstance.id} className="text-xs flex justify-between">
                                      <span>{subTaskInstance.name}</span>
                                      <span className="text-gray-500">
                                        完成率: {subTaskInstance.completionRate ?? 0}% / 設備: {subTaskInstance.equipmentCount ?? 0} / 完成: {subTaskInstance.actualEquipmentCount ?? 0}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 專案未分配工程的任務 */}
        {taskInstancesByEngineering['none'] && taskInstancesByEngineering['none'].length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h4 className="font-medium mb-2 text-lg">直接關聯專案的任務</h4>
            <div className="space-y-2">
              {taskInstancesByEngineering['none'].map(taskInstance => (
                <div key={taskInstance.id} className="border rounded p-2 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{taskInstance.name}</span>
                    <span className="text-xs text-gray-500">
                      設備數量: {taskInstance.equipmentCount ?? 0} / 完成: {taskInstance.actualEquipmentCount ?? 0}
                    </span>
                  </div>
                  {taskInstance.description && (
                    <div className="text-xs text-gray-600">{taskInstance.description}</div>
                  )}
                  {/* 子任務清單 */}
                  {subTaskInstancesMap[taskInstance.id] && subTaskInstancesMap[taskInstance.id].length > 0 && (
                    <div className="mt-2 ml-2">
                      <p className="text-xs text-gray-700 font-medium">子任務：</p>
                      <ul className="list-disc pl-5 space-y-1">
                        {subTaskInstancesMap[taskInstance.id].map(subTaskInstance => (
                          <li key={subTaskInstance.id} className="text-xs flex justify-between">
                            <span>{subTaskInstance.name}</span>
                            <span className="text-gray-500">
                              完成率: {subTaskInstance.completionRate ?? 0}% / 設備: {subTaskInstance.equipmentCount ?? 0} / 完成: {subTaskInstance.actualEquipmentCount ?? 0}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 所有任務匯總 */}
        <div className="mt-4 border-t pt-4">
          <h4 className="font-medium mb-2 text-lg">任務總覽</h4>
          {taskInstances.length === 0 ? (
            <p className="text-gray-500">此專案尚無任務</p>
          ) : (
            <div>
              <p className="text-sm mb-2">共 {taskInstances.length} 個任務</p>
              <div className="flex gap-2">
                <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  待處理: {taskInstances.filter(t => t.status === 'TODO').length}
                </div>
                <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                  進行中: {taskInstances.filter(t => t.status === 'IN_PROGRESS').length}
                </div>
                <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  已完成: {taskInstances.filter(t => t.status === 'DONE').length}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

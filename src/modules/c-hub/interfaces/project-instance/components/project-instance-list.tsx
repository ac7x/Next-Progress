'use client';

import { deleteProject, updateProject } from '@/modules/c-hub/application/project-instance/project-instance-actions';
import { listTaskInstancesByProject } from '@/modules/c-hub/application/task-instance/task-instance-actions';
import { ProjectInstance } from '@/modules/c-hub/domain/project-instance/entities/project-instance-entity';
import { PriorityFormatter } from '@/modules/c-hub/domain/project-instance/value-objects/priority-formatter';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useProjectInstanceTasksCountQuery } from '../hooks/use-project-instance-tasks-count-query';
import { ProjectInstanceDetails } from './Projects-Instance-Overview/project-instance-details';

interface ProjectInstanceListProps {
  projectInstances: ProjectInstance[];
}

function useProjectInstancesTasksDetails(projectInstanceIds: string[]) {
  return useQuery<Record<string, { equipmentCount: number; actualEquipmentCount: number }>>({
    queryKey: ['projectInstancesTasksDetails', projectInstanceIds],
    queryFn: async () => {
      const result: Record<string, { equipmentCount: number; actualEquipmentCount: number }> = {};
      for (const id of projectInstanceIds) {
        const tasks = await listTaskInstancesByProject(id);
        result[id] = {
          equipmentCount: tasks.reduce((sum: number, t) => sum + (t.equipmentCount ?? 0), 0),
          actualEquipmentCount: tasks.reduce((sum: number, t) => sum + (t.actualEquipmentCount ?? 0), 0)
        };
      }
      return result;
    },
    enabled: projectInstanceIds.length > 0
  });
}

// 調整元件名稱與 props
export function ProjectInstanceList({ projectInstances }: ProjectInstanceListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<{ id: string, field: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectInstance, setSelectedProjectInstance] = useState<ProjectInstance | null>(null);
  const [endDateEditing, setEndDateEditing] = useState<string | null>(null);
  const [endDateValue, setEndDateValue] = useState<string>('');
  const router = useRouter();

  // 任務數量
  const { data: tasksCountMap } = useProjectInstanceTasksCountQuery(projectInstances.map(p => p.id));
  // 查詢設備數量與實際完成數量
  const { data: tasksDetailsMap } = useProjectInstancesTasksDetails(projectInstances.map(p => p.id));

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此專案嗎？此操作無法復原。')) {
      return;
    }

    setIsDeleting(id);
    setError(null);

    try {
      await deleteProject(id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '刪除專案失敗');
      console.error('刪除專案失敗:', err);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleShowDetails = (projectInstance: ProjectInstance) => {
    setSelectedProjectInstance(selectedProjectInstance?.id === projectInstance.id ? null : projectInstance);
  };

  // 優化後的優先順序調整 - 直接使用固定增量，避免複雜計算
  const handlePriorityChange = async (id: string, change: number) => {
    setIsUpdating({ id, field: 'priority' });
    setError(null);

    try {
      const project = projectInstances.find(p => p.id === id);
      if (!project) return;

      // 計算新的優先順序值 (0-9 範圍內)
      const currentPriority = project.priority ?? 0;
      let newPriority = currentPriority + change;

      // 範圍限制 (0-9)
      newPriority = Math.max(0, Math.min(9, newPriority));

      // 如果值沒變，不需要更新
      if (newPriority === currentPriority) return;

      // 更新優先順序
      await updateProject(id, { priority: newPriority });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新優先順序失敗');
      console.error('更新優先順序失敗:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  // 處理結束日期編輯
  const handleEndDateClick = (projectInstance: ProjectInstance) => {
    const currentDate = projectInstance.endDate
      ? new Date(projectInstance.endDate).toISOString().split('T')[0]
      : '';
    setEndDateValue(currentDate);
    setEndDateEditing(projectInstance.id);
  };

  const handleEndDateSave = async (id: string) => {
    setIsUpdating({ id, field: 'endDate' });
    setError(null);

    try {
      const endDate = endDateValue ? new Date(endDateValue) : null;
      await updateProject(id, { endDate });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新結束日期失敗');
      console.error('更新結束日期失敗:', err);
    } finally {
      setIsUpdating(null);
      setEndDateEditing(null);
    }
  };

  const handleEndDateCancel = () => {
    setEndDateEditing(null);
  };

  if (projectInstances.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">目前沒有專案，請建立新專案</p>
      </div>
    );
  }

  // 按優先級排序專案列表（數字越小優先度越高）
  const sortedProjectInstances = [...projectInstances].sort((a, b) => {
    // 主要按優先級排序
    const priorityDiff = (a.priority ?? 0) - (b.priority ?? 0);
    // 優先級相同時，按建立時間降序排序
    return priorityDiff !== 0 ? priorityDiff : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      {error && (
        <div className="mb-4 p-2 text-red-600 bg-red-50 rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">專案名稱</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">優先順序</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">任務數量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">設備數量/完成</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">起始日期</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">結束日期</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProjectInstances.map((projectInstance) => {
              // 取得設備數量與實際完成數量
              const detail = tasksDetailsMap?.[projectInstance.id];
              const equipmentCount = detail?.equipmentCount ?? 0;
              const actualEquipmentCount = detail?.actualEquipmentCount ?? 0;
              const percent = equipmentCount > 0 ? Math.round((actualEquipmentCount / equipmentCount) * 100) : 0;
              return (
                <>
                  <tr key={projectInstance.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{projectInstance.name}</td>
                    <td className="px-6 py-4">{projectInstance.description || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {/* 優先級視覺指示器 */}
                          <div
                            className={`w-3 h-3 rounded-full mr-1 ${PriorityFormatter.getColorClass(projectInstance.priority ?? 0)}`}
                          ></div>
                          <span className="tabular-nums">{projectInstance.priority !== null && projectInstance.priority !== undefined ? projectInstance.priority : '—'}</span>
                          <span className="ml-1 text-xs text-gray-500">
                            ({PriorityFormatter.toLabel(projectInstance.priority ?? 0)})
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <button
                            onClick={() => handlePriorityChange(projectInstance.id, -1)}
                            disabled={isUpdating !== null || (projectInstance.priority ?? 0) <= 0}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                            title="提高優先級"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => handlePriorityChange(projectInstance.id, 1)}
                            disabled={isUpdating !== null || (projectInstance.priority ?? 0) >= 9}
                            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                            title="降低優先級"
                          >
                            ▼
                          </button>
                        </div>
                        {isUpdating?.id === projectInstance.id && isUpdating?.field === 'priority' && (
                          <span className="text-xs text-blue-500">更新中...</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tasksCountMap?.[projectInstance.id] ?? '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* 進度條顯示 */}
                      <div className="flex flex-col gap-1 min-w-[120px]">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>完成率</span>
                          <span>{equipmentCount > 0 ? `${percent}%` : '0%'}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded h-2">
                          <div
                            className="bg-green-400 h-2 rounded"
                            style={{
                              width: `${percent}%`,
                              transition: 'width 0.3s'
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>設備數</span>
                          <span>{equipmentCount} 台</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {projectInstance.startDate ? new Date(projectInstance.startDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {endDateEditing === projectInstance.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="date"
                            value={endDateValue}
                            onChange={(e) => setEndDateValue(e.target.value)}
                            className="border rounded px-2 py-1 w-32"
                          />
                          <button
                            onClick={() => handleEndDateSave(projectInstance.id)}
                            className="text-green-600 hover:text-green-800 text-sm"
                            disabled={isUpdating !== null}
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleEndDateCancel}
                            className="text-red-600 hover:text-red-800 text-sm"
                            disabled={isUpdating !== null}
                          >
                            ✗
                          </button>
                          {isUpdating?.id === projectInstance.id && isUpdating?.field === 'endDate' && (
                            <span className="text-xs text-blue-500">更新中...</span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>{projectInstance.endDate ? new Date(projectInstance.endDate).toLocaleDateString() : '—'}</span>
                          <button
                            onClick={() => handleEndDateClick(projectInstance)}
                            className="text-gray-500 hover:text-gray-700 ml-2"
                          >
                            ✎
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(projectInstance.id)}
                        disabled={isDeleting === projectInstance.id || isUpdating !== null}
                        className="text-red-600 hover:text-red-900 mr-4 disabled:opacity-50"
                      >
                        {isDeleting === projectInstance.id ? '刪除中...' : '刪除'}
                      </button>
                      <button
                        onClick={() => handleShowDetails(projectInstance)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {selectedProjectInstance?.id === projectInstance.id ? '收起' : '詳情'}
                      </button>
                    </td>
                  </tr>
                  {selectedProjectInstance?.id === projectInstance.id && (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 bg-gray-50">
                        <ProjectInstanceDetails projectInstance={selectedProjectInstance} />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

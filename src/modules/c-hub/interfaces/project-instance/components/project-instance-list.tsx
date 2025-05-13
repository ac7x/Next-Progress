'use client';

import { deleteProject, updateProject } from '@/modules/c-hub/application/project-instance/project-instance-actions';
import { ProjectInstance } from '@/modules/c-hub/domain/project-instance/entities/project-instance-entity';
import { PriorityFormatter } from '@/modules/c-hub/domain/project-instance/value-objects/priority-formatter';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useProjectInstanceEquipmentStatsQuery } from '../hooks/use-project-instance-equipment-stats-query';
import { useProjectInstanceTasksCountQuery } from '../hooks/use-project-instance-tasks-count-query';
import { ProjectInstanceDetails } from './Projects-Instance-Overview/project-instance-details';
import { EquipmentCompletionProgress } from './equipment-completion-progress';

interface ProjectInstanceListProps {
  projectInstances: ProjectInstance[];
}

// 調整元件名稱與 props
export function ProjectInstanceList({ projectInstances }: ProjectInstanceListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<{ id: string, field: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectInstance, setSelectedProjectInstance] = useState<ProjectInstance | null>(null);
  const [endDateEditing, setEndDateEditing] = useState<string | null>(null);
  const [endDateValue, setEndDateValue] = useState<string>('');
  // 新增：開始日期編輯狀態和值
  const [startDateEditing, setStartDateEditing] = useState<string | null>(null);
  const [startDateValue, setStartDateValue] = useState<string>('');
  const router = useRouter();

  // 任務數量
  const { data: tasksCountMap } = useProjectInstanceTasksCountQuery(projectInstances.map(p => p.id));
  // 查詢設備數量與實際完成數量 - 使用新的專屬 hook
  const { data: equipmentStatsMap } = useProjectInstanceEquipmentStatsQuery(projectInstances.map(p => p.id));

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
      // 修正: 確保日期處理正確
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

  // 新增：處理開始日期編輯功能
  const handleStartDateClick = (projectInstance: ProjectInstance) => {
    const currentDate = projectInstance.startDate
      ? new Date(projectInstance.startDate).toISOString().split('T')[0]
      : '';
    setStartDateValue(currentDate);
    setStartDateEditing(projectInstance.id);
  };

  const handleStartDateSave = async (id: string) => {
    setIsUpdating({ id, field: 'startDate' });
    setError(null);

    try {
      // 修正: 確保日期處理正確
      // 若輸入為空字串，則設為 null (表示未設定)
      // 若有輸入，則建立 Date 物件
      const startDate = startDateValue ? new Date(startDateValue) : null;
      await updateProject(id, { startDate });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新開始日期失敗');
      console.error('更新開始日期失敗:', err);
    } finally {
      setIsUpdating(null);
      setStartDateEditing(null);
    }
  };

  const handleStartDateCancel = () => {
    setStartDateEditing(null);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">開始日期</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">結束日期</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">建立時間</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProjectInstances.map((projectInstance) => {
              // 取得設備數量與實際完成數量
              const stats = equipmentStatsMap?.[projectInstance.id];
              const equipmentCount = stats?.equipmentCount ?? 0;
              const actualEquipmentCount = stats?.actualEquipmentCount ?? 0;
              const percent = stats?.completionRate ?? 0; // 直接使用已計算好的完成率
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
                      {/* 使用新的設備完成進度元件 */}
                      <EquipmentCompletionProgress
                        equipmentCount={equipmentCount}
                        actualEquipmentCount={actualEquipmentCount}
                        completionRate={percent}
                        className="min-w-[120px]"
                      />
                    </td>
                    {/* 新增：開始日期欄位 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {startDateEditing === projectInstance.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="date"
                            value={startDateValue}
                            onChange={(e) => setStartDateValue(e.target.value)}
                            className="border rounded px-2 py-1 w-32"
                          />
                          <button
                            onClick={() => handleStartDateSave(projectInstance.id)}
                            className="text-green-600 hover:text-green-800 text-sm"
                            disabled={isUpdating !== null}
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleStartDateCancel}
                            className="text-red-600 hover:text-red-800 text-sm"
                            disabled={isUpdating !== null}
                          >
                            ✗
                          </button>
                          {isUpdating?.id === projectInstance.id && isUpdating?.field === 'startDate' && (
                            <span className="text-xs text-blue-500">更新中...</span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>{projectInstance.startDate ? new Date(projectInstance.startDate).toLocaleDateString() : '—'}</span>
                          <button
                            onClick={() => handleStartDateClick(projectInstance)}
                            className="text-gray-500 hover:text-gray-700 ml-2"
                            title="設置專案預計開始日期"
                          >
                            ✎
                          </button>
                        </div>
                      )}
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
                            title="設置專案預計結束日期"
                          >
                            ✎
                          </button>
                        </div>
                      )}
                    </td>
                    {/* 新增：專案建立時間欄位 */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(projectInstance.createdAt).toLocaleDateString()}
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
                      <td colSpan={9} className="px-6 py-4 bg-gray-50">
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

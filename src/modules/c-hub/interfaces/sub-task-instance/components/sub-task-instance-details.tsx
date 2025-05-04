'use client';

import { deleteSubTaskInstance, updateSubTaskInstanceCompletion, updateSubTaskInstanceStatus } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance-actions';
import { SubTaskInstance, SubTaskInstanceStatus } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { useState } from 'react';
import { useSubTaskInstanceUpdate } from '../hooks/use-sub-task-instance-update';

interface SubTaskInstanceDetailsProps {
  subTaskInstance: SubTaskInstance;
}

export function SubTaskInstanceDetails({ subTaskInstance }: SubTaskInstanceDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [completionRate, setCompletionRate] = useState(subTaskInstance.completionRate);
  const { updateSubTaskInstanceField, isUpdating, error } = useSubTaskInstanceUpdate();

  const handleStatusChange = async (status: SubTaskInstanceStatus) => {
    try {
      await updateSubTaskInstanceStatus(subTaskInstance.id, status);
      // React Query 自動同步
    } catch (err) {
      console.error('更新子任務狀態失敗:', err);
    }
  };

  const handleCompletionChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseInt(e.target.value);
    setCompletionRate(newRate);
    try {
      await updateSubTaskInstanceCompletion(subTaskInstance.id, newRate);
      // React Query 自動同步
    } catch (err) {
      console.error('更新完成率失敗:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('確定要刪除此子任務嗎？此操作無法復原。')) return;
    setIsDeleting(true);
    try {
      await deleteSubTaskInstance(subTaskInstance.id);
      // React Query 自動同步
    } catch (err) {
      console.error('刪除子任務失敗:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // 根據完成率生成顏色樣式
  const getProgressColorClass = () => {
    if (subTaskInstance.completionRate >= 100) return 'bg-green-500';
    if (subTaskInstance.completionRate >= 70) return 'bg-green-400';
    if (subTaskInstance.completionRate >= 30) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className={`p-2 rounded-md border ${subTaskInstance.status === 'DONE' ? 'bg-green-50 border-green-200' :
      subTaskInstance.status === 'IN_PROGRESS' ? 'bg-blue-50 border-blue-200' :
        'bg-gray-50 border-gray-200'
      }`}>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${subTaskInstance.priority === 0 ? 'bg-red-500' :
                subTaskInstance.priority === 1 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
            ></div>
            <span className="font-medium text-sm" onClick={() => setIsExpanded(!isExpanded)}>
              {subTaskInstance.name}
            </span>
          </div>
          {isExpanded && subTaskInstance.description && (
            <p className="text-xs text-gray-600 mt-1 ml-4">{subTaskInstance.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 狀態按鈕或選擇器 */}
          <select
            value={subTaskInstance.status}
            onChange={(e) => handleStatusChange(e.target.value as SubTaskInstanceStatus)}
            className="text-xs border rounded px-1 py-0.5"
            disabled={isUpdating}
          >
            <option value="TODO">待處理</option>
            <option value="IN_PROGRESS">進行中</option>
            <option value="DONE">已完成</option>
          </select>

          {/* 刪除按鈕 */}
          <button
            onClick={handleDelete}
            disabled={isDeleting || isUpdating}
            className="text-red-500 hover:text-red-700 text-xs"
          >
            {isDeleting ? '刪除中...' : '刪除'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 ml-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500">完成率:</span>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={completionRate}
              onChange={handleCompletionChange}
              className="w-24 h-2"
              disabled={isUpdating}
            />
            <span className="text-xs">{completionRate}%</span>
          </div>

          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColorClass()}`}
              style={{ width: `${subTaskInstance.completionRate || 0}%` }}
            ></div>
          </div>

          {/* 子任務的其他詳細信息 */}
          <div className="grid grid-cols-2 gap-1 mt-2 text-xs text-gray-500">
            {subTaskInstance.plannedStart && (
              <div>計劃開始: {new Date(subTaskInstance.plannedStart).toLocaleDateString()}</div>
            )}
            {subTaskInstance.plannedEnd && (
              <div>計劃結束: {new Date(subTaskInstance.plannedEnd).toLocaleDateString()}</div>
            )}
            {subTaskInstance.startDate && (
              <div>實際開始: {new Date(subTaskInstance.startDate).toLocaleDateString()}</div>
            )}
            {subTaskInstance.endDate && (
              <div>實際結束: {new Date(subTaskInstance.endDate).toLocaleDateString()}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

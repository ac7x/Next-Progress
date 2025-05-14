'use client';

import { deleteSubTaskInstanceCommand, updateSubTaskInstanceCompletionCommand } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance-command';
import { SubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance/entities/sub-task-instance-entity';
import { useQueryClient } from '@tanstack/react-query';
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
  const [actualEquipmentCount, setActualEquipmentCount] = useState(subTaskInstance.actualEquipmentCount ?? 0);
  const { updateSubTaskInstance, updateSubTaskInstanceField, isUpdating, error } = useSubTaskInstanceUpdate();
  const queryClient = useQueryClient();

  // 根據完成率自動判斷狀態，移除手動狀態更改
  const handleCompletionChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRate = parseInt(e.target.value);
    setCompletionRate(newRate);
    try {
      // 只需要更新完成率，狀態會在領域服務中自動推導
      await updateSubTaskInstanceCompletionCommand(subTaskInstance.id, newRate);
      // React Query 自動同步
    } catch (err) {
      console.error('更新完成率失敗:', err);
    }
  };

  const handleActualEquipmentCountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCount = parseInt(e.target.value, 10) || 0;
    setActualEquipmentCount(newCount);

    // 計算新的完成率
    const equipCount = subTaskInstance.equipmentCount || 1;
    const newCompletionRate = equipCount > 0 ? Math.min(100, Math.round((newCount / equipCount) * 100)) : 0;

    // 同時更新實際完成數量和完成率，確保兩者保持一致
    await updateSubTaskInstance(subTaskInstance.id, {
      actualEquipmentCount: newCount,
      completionRate: newCompletionRate
    });

    // 更新前端狀態
    setCompletionRate(newCompletionRate);
  };

  const handleDelete = async () => {
    if (!confirm('確定要刪除此子任務嗎？此操作無法復原。')) return;
    setIsDeleting(true);
    try {
      await deleteSubTaskInstanceCommand(subTaskInstance.id);
      // invalidateQueries 傳入物件型態，確保刷新
      await queryClient.invalidateQueries({ queryKey: ['subTaskInstances', subTaskInstance.taskId] });
    } catch (err) {
      console.error('刪除子任務失敗:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // 新增：可編輯計劃/實際開始結束時間
  const handleDateChange = async (field: 'plannedStart' | 'plannedEnd' | 'startDate' | 'endDate', value: string) => {
    await updateSubTaskInstanceField(subTaskInstance.id, field, value ? new Date(value) : null);
    // React Query 自動同步
  };

  // 根據完成率生成顏色樣式
  const getProgressColorClass = () => {
    if (subTaskInstance.completionRate === 100) return 'bg-green-500';
    if (subTaskInstance.completionRate > 0) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  return (
    <div className={`p-2 rounded-md border ${subTaskInstance.completionRate === 100 ? 'bg-green-50 border-green-200' :
      subTaskInstance.completionRate > 0 ? 'bg-blue-50 border-blue-200' :
        'bg-gray-50 border-gray-200'
      }`}>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          {/* 移除名稱與描述顯示，僅保留狀態指示點 */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${subTaskInstance.priority === 0 ? 'bg-red-500' :
                subTaskInstance.priority === 1 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
            ></div>
            {/* 名稱與描述已移除 */}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* 顯示狀態指示標籤（根據完成率自動判斷） */}
          <span className={`text-xs px-2 py-0.5 rounded ${subTaskInstance.completionRate === 0 ? 'bg-gray-200 text-gray-700' :
            subTaskInstance.completionRate === 100 ? 'bg-green-200 text-green-800' :
              'bg-yellow-200 text-yellow-800'
            }`}>
            {subTaskInstance.completionRate === 0 ? '待處理' :
              subTaskInstance.completionRate === 100 ? '已完成' :
                '進行中'}
          </span>
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
      {/* 展開區塊仍可保留進度與數量等資訊 */}
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
            <span className="text-xs">{completionRate}%
              {completionRate === 0 ? ' (待處理)' :
                completionRate === 100 ? ' (已完成)' :
                  ' (進行中)'}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-500">實際完成數量:</span>
            <input
              type="number"
              min="0"
              value={actualEquipmentCount}
              onChange={handleActualEquipmentCountChange}
              className="w-16 text-xs border rounded px-1 py-0.5"
              disabled={isUpdating}
            />
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getProgressColorClass()}`}
              style={{ width: `${subTaskInstance.completionRate || 0}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-2 text-xs text-gray-500">
            <div>
              計劃開始:
              <input
                type="date"
                className="ml-1 border rounded px-1 py-0.5"
                value={subTaskInstance.plannedStart ? new Date(subTaskInstance.plannedStart).toISOString().slice(0, 10) : ''}
                onChange={e => handleDateChange('plannedStart', e.target.value)}
                disabled={isUpdating}
              />
            </div>
            <div>
              計劃結束:
              <input
                type="date"
                className="ml-1 border rounded px-1 py-0.5"
                value={subTaskInstance.plannedEnd ? new Date(subTaskInstance.plannedEnd).toISOString().slice(0, 10) : ''}
                onChange={e => handleDateChange('plannedEnd', e.target.value)}
                disabled={isUpdating}
              />
            </div>
            <div>
              實際開始:
              <input
                type="date"
                className="ml-1 border rounded px-1 py-0.5"
                value={subTaskInstance.startDate ? new Date(subTaskInstance.startDate).toISOString().slice(0, 10) : ''}
                onChange={e => handleDateChange('startDate', e.target.value)}
                disabled={isUpdating}
              />
            </div>
            <div>
              實際結束:
              <input
                type="date"
                className="ml-1 border rounded px-1 py-0.5"
                value={subTaskInstance.endDate ? new Date(subTaskInstance.endDate).toISOString().slice(0, 10) : ''}
                onChange={e => handleDateChange('endDate', e.target.value)}
                disabled={isUpdating}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

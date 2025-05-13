'use client';

import { taskSplitSubtaskCommand } from '@/modules/c-hub/application/task-instance/task-split-command';
import { TaskInstance } from '@/modules/c-hub/domain/task-instance';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface TaskInstanceSplitSubtaskFormProps {
    taskInstance: TaskInstance;
    onCloseAction: () => void;
}

/**
 * 任務分割子任務表單元件
 * 允許從現有任務分割出子任務，可設置預計開始/結束時間和設備數量
 */
export function TaskInstanceSplitSubtaskForm({ taskInstance, onCloseAction }: TaskInstanceSplitSubtaskFormProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 表單狀態
    const [name, setName] = useState<string>(`${taskInstance.name} - 子任務`);
    const [description, setDescription] = useState<string>('');
    const [equipmentCount, setEquipmentCount] = useState<number | undefined>(undefined);
    const [plannedStart, setPlannedStart] = useState<string>('');
    const [plannedEnd, setPlannedEnd] = useState<string>('');

    // 當前父任務的可分配設備數量上限
    const remainingEquipment = (taskInstance.equipmentCount || 0) - (taskInstance.actualEquipmentCount || 0);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (isSubmitting) return;

        // 驗證結束時間不能早於開始時間
        if (plannedStart && plannedEnd && new Date(plannedEnd) < new Date(plannedStart)) {
            setError('預計結束時間不能早於開始時間');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            // 構建子任務數據 - 移除驗證邏輯，由 Command 層統一處理
            const subTaskData = {
                name: name.trim(), // 使用者自訂名稱
                description,
                plannedStart: plannedStart ? new Date(plannedStart) : null,
                plannedEnd: plannedEnd ? new Date(plannedEnd) : null,
                equipmentCount,
                actualEquipmentCount: 0 // 新分割的子任務，實際使用數量默認為 0
            };

            // 調用專用的任務分割命令
            await taskSplitSubtaskCommand(taskInstance.id, subTaskData);

            // 重新驗證查詢
            await queryClient.invalidateQueries({
                queryKey: ['subTaskInstances', taskInstance.id]
            });

            // 同時刷新父任務數據
            await queryClient.invalidateQueries({
                queryKey: ['taskInstances']
            });

            await queryClient.invalidateQueries({
                queryKey: ['allTasks']
            });

            // 重置表單並關閉
            router.refresh();
            onCloseAction();
        } catch (err) {
            console.error('分割子任務失敗:', err);
            setError(err instanceof Error ? err.message : '分割子任務失敗');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">從任務「{taskInstance.name}」分割子任務</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm text-gray-700 mb-1">
                            子任務名稱
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded p-2 text-sm"
                            placeholder="請輸入子任務名稱"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm text-gray-700 mb-1">
                            子任務描述
                        </label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded p-2 text-sm"
                            placeholder="請輸入子任務描述"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="plannedStart" className="block text-sm text-gray-700 mb-1">
                                預計開始時間
                            </label>
                            <input
                                type="date"
                                id="plannedStart"
                                value={plannedStart}
                                onChange={(e) => setPlannedStart(e.target.value)}
                                className="w-full border rounded p-2 text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="plannedEnd" className="block text-sm text-gray-700 mb-1">
                                預計結束時間
                            </label>
                            <input
                                type="date"
                                id="plannedEnd"
                                value={plannedEnd}
                                onChange={(e) => setPlannedEnd(e.target.value)}
                                className="w-full border rounded p-2 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="equipmentCount" className="block text-sm text-gray-700 mb-1">
                            分配設備數量 (剩餘可分配: {remainingEquipment})
                        </label>
                        <input
                            type="number"
                            id="equipmentCount"
                            min="0"
                            max={remainingEquipment}
                            value={equipmentCount ?? ''}
                            onChange={(e) => setEquipmentCount(e.target.value ? Number(e.target.value) : undefined)}
                            className="w-full border rounded p-2 text-sm"
                            placeholder="0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            父任務總設備數量: {taskInstance.equipmentCount || 0}, 已使用: {taskInstance.actualEquipmentCount || 0}
                        </p>
                    </div>

                    {error && (
                        <div className="p-2 text-red-600 bg-red-50 rounded border border-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 pt-2">
                        <button
                            type="button"
                            onClick={onCloseAction}
                            className="px-4 py-2 border rounded text-sm"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 rounded text-sm text-white
                ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                        >
                            {isSubmitting ? '處理中...' : '分割子任務'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

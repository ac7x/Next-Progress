import { EngineeringInstance } from '@/modules/c-hub/domain/engineering-instance';
import { SubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance';
import { TaskInstance } from '@/modules/c-hub/domain/task-instance';
import { EquipmentCompletionPercent } from './project-instance-equipment-completion-percent';

interface Props {
    engineeringInstances: EngineeringInstance[];
    taskInstancesByEngineering: Record<string, TaskInstance[]>;
    subTaskInstancesMap: Record<string, SubTaskInstance[]>;
    taskUpdating: Record<string, boolean>;
    taskUpdateError: Record<string, string | null>;
    subTaskUpdating: Record<string, boolean>;
    subTaskUpdateError: Record<string, string | null>;
    onTaskActualEquipmentCountChange: (taskId: string, value: number) => void;
    onSubTaskActualEquipmentCountChange: (subTaskId: string, value: number, parentTaskId: string) => void;
}

export function EngineeringInstanceList({
    engineeringInstances,
    taskInstancesByEngineering,
    subTaskInstancesMap,
    taskUpdating,
    taskUpdateError,
    subTaskUpdating,
    subTaskUpdateError,
    onTaskActualEquipmentCountChange,
    onSubTaskActualEquipmentCountChange
}: Props) {
    return (
        <div className="mt-4 border-t pt-4">
            <h4 className="font-medium mb-2 text-lg">工程列表</h4>
            {engineeringInstances.length === 0 ? (
                <p className="text-gray-500">此專案尚無工程</p>
            ) : (
                <ul className="list-disc pl-5">
                    {engineeringInstances.map(engineeringInstance => (
                        <li key={engineeringInstance.id} className="mb-2">
                            <div className="font-medium">{engineeringInstance.name.getValue()}</div>
                            {engineeringInstance.description &&
                                <div className="text-gray-600 text-sm">{engineeringInstance.description.getValue()}</div>}
                            {taskInstancesByEngineering[engineeringInstance.id] && taskInstancesByEngineering[engineeringInstance.id].length > 0 && (
                                <div className="mt-1 ml-4">
                                    <p className="text-sm text-gray-700 font-medium">相關任務:</p>
                                    <div className="mt-2 space-y-2">
                                        {taskInstancesByEngineering[engineeringInstance.id].map(taskInstance => (
                                            <TaskWithSubTasks
                                                key={taskInstance.id}
                                                taskInstance={taskInstance}
                                                subTaskInstances={subTaskInstancesMap[taskInstance.id] || []}
                                                taskUpdating={taskUpdating[taskInstance.id]}
                                                taskUpdateError={taskUpdateError[taskInstance.id]}
                                                subTaskUpdating={subTaskUpdating}
                                                subTaskUpdateError={subTaskUpdateError}
                                                onTaskActualEquipmentCountChange={onTaskActualEquipmentCountChange}
                                                onSubTaskActualEquipmentCountChange={onSubTaskActualEquipmentCountChange}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export function TaskWithSubTasks({
    taskInstance,
    subTaskInstances,
    taskUpdating,
    taskUpdateError,
    subTaskUpdating,
    subTaskUpdateError,
    onTaskActualEquipmentCountChange,
    onSubTaskActualEquipmentCountChange
}: {
    taskInstance: TaskInstance;
    subTaskInstances: SubTaskInstance[];
    taskUpdating: boolean;
    taskUpdateError: string | null;
    subTaskUpdating: Record<string, boolean>;
    subTaskUpdateError: Record<string, string | null>;
    onTaskActualEquipmentCountChange: (taskId: string, value: number) => void;
    onSubTaskActualEquipmentCountChange: (subTaskId: string, value: number, parentTaskId: string) => void;
}) {
    return (
        <div className="border rounded p-2 bg-gray-50">
            <div className="flex justify-between items-center">
                <span className="font-medium">{taskInstance.name}</span>
                <span className="text-xs text-gray-500 flex items-center">
                    設備數量: {taskInstance.equipmentCount ?? 0} / 完成:
                    <input
                        type="number"
                        min={0}
                        max={taskInstance.equipmentCount ?? undefined}
                        value={taskInstance.actualEquipmentCount ?? 0}
                        onChange={e => onTaskActualEquipmentCountChange(taskInstance.id, Number(e.target.value))}
                        disabled={taskUpdating}
                        className="w-16 ml-1 mr-1 px-1 py-0.5 border rounded text-xs"
                        style={{ width: 60 }}
                    />
                    <EquipmentCompletionPercent
                        equipmentCount={taskInstance.equipmentCount}
                        actualEquipmentCount={taskInstance.actualEquipmentCount}
                    />
                    {taskUpdating && <span className="ml-1 text-blue-500">儲存中...</span>}
                    {taskUpdateError && <span className="ml-1 text-red-500">{taskUpdateError}</span>}
                </span>
            </div>
            {taskInstance.description && (
                <div className="text-xs text-gray-600">{taskInstance.description}</div>
            )}
            {subTaskInstances.length > 0 && (
                <div className="mt-2 ml-2">
                    <p className="text-xs text-gray-700 font-medium">子任務：</p>
                    <ul className="list-disc pl-5 space-y-1">
                        {subTaskInstances.map(subTaskInstance => (
                            <li key={subTaskInstance.id} className="text-xs flex justify-between items-center">
                                <span>{subTaskInstance.name}</span>
                                <span className="text-gray-500 flex items-center">
                                    完成率: {subTaskInstance.completionRate ?? 0}% / 設備: {subTaskInstance.equipmentCount ?? 0} / 完成:
                                    <input
                                        type="number"
                                        min={0}
                                        max={subTaskInstance.equipmentCount ?? undefined}
                                        value={subTaskInstance.actualEquipmentCount ?? 0}
                                        onChange={e => onSubTaskActualEquipmentCountChange(subTaskInstance.id, Number(e.target.value), taskInstance.id)}
                                        disabled={subTaskUpdating[subTaskInstance.id]}
                                        className="w-14 ml-1 mr-1 px-1 py-0.5 border rounded text-xs"
                                        style={{ width: 50 }}
                                    />
                                    <EquipmentCompletionPercent
                                        equipmentCount={subTaskInstance.equipmentCount}
                                        actualEquipmentCount={subTaskInstance.actualEquipmentCount}
                                    />
                                    {subTaskUpdating[subTaskInstance.id] && <span className="ml-1 text-blue-500">儲存中...</span>}
                                    {subTaskUpdateError[subTaskInstance.id] && <span className="ml-1 text-red-500">{subTaskUpdateError[subTaskInstance.id]}</span>}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export { EngineeringInstanceList as ProjectInstanceEngineeringList };


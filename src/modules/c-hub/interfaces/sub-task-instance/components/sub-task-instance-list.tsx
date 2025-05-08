import { SubTaskInstance } from '@/modules/c-hub/domain/sub-task-instance/sub-task-instance-entity';
import { SubTaskInstanceDetails } from './sub-task-instance-details';

export function SubTaskInstanceList({ subTaskInstances }: { subTaskInstances: SubTaskInstance[] }) {
  if (subTaskInstances.length === 0) {
    return <p className="text-sm text-gray-500">此任務尚無子任務</p>;
  }

  // 依 priority（數字）排序，若相同則依名稱 #1 > #2 > #3
  const sortedSubTaskInstances = [...subTaskInstances].sort((a, b) => {
    const pa = a.priority ?? 0;
    const pb = b.priority ?? 0;
    if (pa !== pb) return pa - pb;
    const getNum = (name: string) => {
      const match = name.match(/#(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };
    return getNum(a.name) - getNum(b.name);
  });

  // 聚合：父任務的完成率與實際完成數量
  const totalEquipmentCount = sortedSubTaskInstances.reduce(
    (sum, st) => sum + (st.equipmentCount ?? 0),
    0
  );
  const totalActualEquipmentCount = sortedSubTaskInstances.reduce(
    (sum, st) => sum + (st.actualEquipmentCount ?? 0),
    0
  );
  const completionRate =
    totalEquipmentCount > 0
      ? Math.round((totalActualEquipmentCount / totalEquipmentCount) * 100)
      : 0;

  return (
    <div className="space-y-2">
      {/* 顯示聚合資訊 */}
      <div className="flex items-center justify-between px-2 py-1 bg-gray-50 rounded border text-xs mb-2">
        <div>
          <span className="text-gray-600">實際完成數量：</span>
          <span className="font-mono">{totalActualEquipmentCount}</span>
        </div>
        <div>
          <span className="text-gray-600">完成率：</span>
          <span className="font-mono">{completionRate}%</span>
        </div>
      </div>
      {sortedSubTaskInstances.map((subTaskInstance) => (
        <div key={subTaskInstance.id} className="border rounded p-2 bg-white">
          {/* 子任務主要資訊區塊 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${subTaskInstance.status === 'DONE'
                ? 'bg-green-500'
                : subTaskInstance.status === 'IN_PROGRESS'
                  ? 'bg-blue-500'
                  : 'bg-gray-400'
                }`} />
              <span className="font-medium text-sm">{subTaskInstance.name}</span>
              <span className="text-xs text-gray-500">
                狀態: {subTaskInstance.status === 'TODO' ? '待處理' : subTaskInstance.status === 'IN_PROGRESS' ? '進行中' : '已完成'}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              完成率: {subTaskInstance.completionRate ?? 0}%
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-1 text-xs text-gray-600">
            <div>
              預計開始: {subTaskInstance.plannedStart ? new Date(subTaskInstance.plannedStart).toLocaleDateString() : '—'}
            </div>
            <div>
              預計數量: {subTaskInstance.equipmentCount ?? 0}
            </div>
          </div>
          {/* 詳細操作區塊（如進度、刪除等） */}
          <div className="mt-2">
            <SubTaskInstanceDetails subTaskInstance={subTaskInstance} />
          </div>
        </div>
      ))}
    </div>
  );
}

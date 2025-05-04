/**
 * 子任務區塊元件
 * 功能：根據任務實體ID展示其所有子任務
 * 使用方式：
 * <TaskInstanceSubTaskInstancesSection taskInstanceId={taskInstanceId} />
 */

import SubTaskInstanceSection from '@/modules/c-hub/interfaces/sub-task-instance/sub-task-instance-section';

// 改為預設匯出
export default async function TaskInstanceSubTaskInstancesSection({ taskInstanceId }: { taskInstanceId: string }) {
  return <SubTaskInstanceSection taskInstanceId={taskInstanceId} />;
}

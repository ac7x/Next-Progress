import SubTaskInstanceSection from '@/modules/c-hub/interfaces/sub-task-instance/sub-task-instance-section';

// 改為預設匯出
export default async function TaskInstanceSubTaskInstancesSection({ taskInstanceId }: { taskInstanceId: string }) {
  return <SubTaskInstanceSection taskInstanceId={taskInstanceId} />;
}

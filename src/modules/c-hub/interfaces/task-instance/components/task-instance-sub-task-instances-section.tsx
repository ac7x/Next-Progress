import SubTaskInstanceSection from '@/modules/c-hub/interfaces/sub-task-instance/sub-task-instance-section';

export default async function TaskInstanceSubTaskInstancesSection({ taskInstanceId }: { taskInstanceId: string }) {
  return <SubTaskInstanceSection taskInstanceId={taskInstanceId} />;
}

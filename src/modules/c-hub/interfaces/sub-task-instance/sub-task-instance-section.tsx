import { listSubTasksInstanceByTaskId } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance-actions';
import { SubTaskInstanceForm } from './components/sub-task-instance-form';
import { SubTaskInstanceList } from './components/sub-task-instance-list';

export default async function SubTaskInstanceSection({ taskInstanceId }: { taskInstanceId: string }) {
    const subTaskInstances = await listSubTasksInstanceByTaskId(taskInstanceId);
    return (
        <section className="mt-3 pt-3 border-t border-dashed">
            <SubTaskInstanceForm taskInstanceId={taskInstanceId} />
            <SubTaskInstanceList subTaskInstances={subTaskInstances} />
        </section>
    );
}

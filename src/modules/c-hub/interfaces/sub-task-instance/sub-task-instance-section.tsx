import { SubTaskInstanceForm } from './components/sub-task-instance-form';
import { createSubTaskInstanceFormAction } from '@/modules/c-hub/application/sub-task-instance/sub-task-instance.command';
import { Suspense } from 'react';
import { SubTaskInstanceListWrapper } from './sub-task-instance-list-wrapper';

// Server Component：僅負責渲染與查詢（Query Concern），命令交由 Server Action
export default async function SubTaskInstanceSection({ taskInstanceId }: { taskInstanceId: string }) {
    return (
        <section className="mt-3 pt-3 border-t border-dashed">
            {/* Command Concern：表單送出交由 Server Action 處理 */}
            <SubTaskInstanceForm taskInstanceId={taskInstanceId} action={createSubTaskInstanceFormAction} />
            {/* Query Concern：渲染子任務列表（SRP） */}
            <Suspense fallback={<div className="text-xs text-gray-400">載入子任務...</div>}>
                <SubTaskInstanceListWrapper taskInstanceId={taskInstanceId} />
            </Suspense>
        </section>
    );
}

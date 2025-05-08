// src/modules/c-hub/application/project-instance/project-instance-progress-summary-query.ts
import { listSubTasksInstanceByTaskId } from '../sub-task-instance/sub-task-instance-actions';
import { listTaskInstancesByProject } from '../task-instance/task-instance-actions';

export interface ProjectInstanceProgressSummary {
    totalTasks: number;
    totalSubTasks: number;
    totalEquipment: number;
    doneEquipment: number;
    percent: number;
}

export async function getProjectInstanceProgressSummary(projectInstanceId: string): Promise<ProjectInstanceProgressSummary> {
    const tasks = await listTaskInstancesByProject(projectInstanceId);
    let totalTasks = tasks.length;
    let totalSubTasks = 0;
    let totalEquipment = 0;
    let doneEquipment = 0;

    for (const task of tasks) {
        totalEquipment += task.equipmentCount ?? 0;
        doneEquipment += task.actualEquipmentCount ?? 0;
        const subTasks = await listSubTasksInstanceByTaskId(task.id);
        totalSubTasks += subTasks.length;
        for (const st of subTasks) {
            totalEquipment += st.equipmentCount ?? 0;
            doneEquipment += st.actualEquipmentCount ?? 0;
        }
    }

    const percent = totalEquipment > 0 ? Math.round((doneEquipment / totalEquipment) * 100) : 0;

    return {
        totalTasks,
        totalSubTasks,
        totalEquipment,
        doneEquipment,
        percent
    };
}
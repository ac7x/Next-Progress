import { ProjectInstance } from '@/modules/c-hub/domain/project-instance/entities/project-instance-entity';
import { PriorityFormatter } from '@/modules/c-hub/domain/project-instance/value-objects/priority-formatter';

interface Props {
    projectInstance: ProjectInstance;
}

export function ProjectInstanceBasicInfo({ projectInstance }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <p className="text-sm text-gray-500">建立者</p>
                <p>{projectInstance.createdBy || '未指定'}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">優先順序</p>
                <p className={`flex items-center ${PriorityFormatter.getTextColorClass(projectInstance.priority ?? 0)}`}>
                    <span className={`w-3 h-3 rounded-full mr-2 ${PriorityFormatter.getColorClass(projectInstance.priority ?? 0)}`}></span>
                    {projectInstance.priority !== null && projectInstance.priority !== undefined ? (
                        <>
                            {projectInstance.priority} - {PriorityFormatter.toLabel(projectInstance.priority)}
                        </>
                    ) : '未設定'}
                </p>
            </div>
            <div>
                <p className="text-sm text-gray-500">預計開始日期</p>
                <p>{projectInstance.startDate ? new Date(projectInstance.startDate).toLocaleString() : '未設定'}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">預計結束日期</p>
                <p>{projectInstance.endDate ? new Date(projectInstance.endDate).toLocaleString() : '未設定'}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">建立時間</p>
                <p>{new Date(projectInstance.createdAt).toLocaleString()}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">最後更新</p>
                <p>{new Date(projectInstance.updatedAt).toLocaleString()}</p>
            </div>
        </div>
    );
}

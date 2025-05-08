import { ProjectInstance } from '@/modules/c-hub/domain/project-instance/project-instance-entity';

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
                <p>{projectInstance.priority !== null && projectInstance.priority !== undefined ? projectInstance.priority : '未設定'}</p>
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

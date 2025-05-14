import { cva } from 'class-variance-authority';

// 設備完成率元件的變體配置
const progressBarVariants = cva(
    'h-2 rounded transition-all duration-300',
    {
        variants: {
            status: {
                notStarted: 'bg-gray-400',
                inProgress: 'bg-blue-500',
                completed: 'bg-green-500'
            }
        },
        defaultVariants: {
            status: 'notStarted'
        }
    }
);

interface EquipmentCompletionProgressProps {
    equipmentCount: number;
    actualEquipmentCount: number;
    completionRate: number;
    className?: string;
    showDetails?: boolean;
}

/**
 * 設備完成進度元件
 * 顯示設備數量總計、實際完成數量及完成百分比
 */
export function EquipmentCompletionProgress({
    equipmentCount,
    actualEquipmentCount,
    completionRate,
    className = '',
    showDetails = true
}: EquipmentCompletionProgressProps) {
    // 根據完成率確定進度條狀態，保持與子任務狀態判斷邏輯一致
    const getProgressStatus = () => {
        if (completionRate === 100) return 'completed';
        if (completionRate > 0) return 'inProgress';
        return 'notStarted';
    };

    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            <div className="flex justify-between text-xs text-gray-500">
                <span>完成率</span>
                <span>{`${completionRate}%`}</span>
            </div>
            <div className="w-full bg-gray-200 rounded h-2">
                <div
                    className={progressBarVariants({ status: getProgressStatus() })}
                    style={{ width: `${completionRate}%` }}
                />
            </div>
            {showDetails && (
                <div className="flex justify-between text-xs text-gray-400">
                    <span>設備數</span>
                    <span>{`${actualEquipmentCount} / ${equipmentCount} 台`}</span>
                </div>
            )}
        </div>
    );
}

import { TagType } from '@/modules/c-tag/domain/tag-entity';
import { tagDisplayUtils } from '@/modules/c-tag/interfaces/utils/tag-display-utils';

// 預設用於工程/任務/子任務進度的 TagType
const PROGRESS_TAG_TYPE = TagType.TASK_INSTANCE;

export function EquipmentCompletionPercent({
    equipmentCount,
    actualEquipmentCount,
    className = ''
}: {
    equipmentCount?: number | null;
    actualEquipmentCount?: number | null;
    className?: string;
}) {
    const total = typeof equipmentCount === 'number' ? equipmentCount : 0;
    const done = typeof actualEquipmentCount === 'number' ? actualEquipmentCount : 0;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    let display: React.ReactNode;
    let color = '';
    let textColor = '';

    if (percent === 0) {
        display = '待處理';
        color = tagDisplayUtils.getTagTypeColor(PROGRESS_TAG_TYPE);
        textColor = tagDisplayUtils.getTagTypeTextColor(PROGRESS_TAG_TYPE);
    } else if (percent >= 100) {
        display = '已完成';
        color = tagDisplayUtils.getTagTypeColor(PROGRESS_TAG_TYPE);
        textColor = tagDisplayUtils.getTagTypeTextColor(PROGRESS_TAG_TYPE);
    } else {
        display = `${percent}%`;
        // 進度色彩根據百分比調整
        if (percent >= 70) {
            color = '#22c55e'; // 綠色
            textColor = '#166534';
        } else if (percent >= 30) {
            color = '#facc15'; // 黃色
            textColor = '#92400e';
        } else {
            color = '#f87171'; // 紅色
            textColor = '#991b1b';
        }
    }

    return (
        <span
            className={`ml-2 text-xs px-2 py-0.5 rounded-full font-semibold ${className}`}
            style={{
                backgroundColor: color,
                color: textColor,
                minWidth: 48,
                display: 'inline-block',
                textAlign: 'center'
            }}
        >
            {display}
        </span>
    );
}

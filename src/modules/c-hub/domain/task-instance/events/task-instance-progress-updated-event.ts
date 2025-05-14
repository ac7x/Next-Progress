/**
 * 任務實例進度更新事件
 * 當任務的實際完成數量或完成率發生變化時觸發
 */
export class TaskInstanceProgressUpdatedEvent {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly previousCompletionRate: number,
        public readonly newCompletionRate: number,
        public readonly previousActualEquipmentCount: number | null,
        public readonly newActualEquipmentCount: number | null
    ) {
        console.log(`任務 ${name} (${id}) 進度已更新: 
            完成率 ${previousCompletionRate}% -> ${newCompletionRate}%, 
            實際完成數量 ${previousActualEquipmentCount || 0} -> ${newActualEquipmentCount || 0}`);
    }
}

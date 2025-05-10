/**
 * 任務實例完成事件
 * 當任務實例達到完成狀態時觸發
 */
export class TaskInstanceCompletedEvent {
    constructor(
        public readonly id: string,
        public readonly projectId: string
    ) {
        console.log(`任務已完成: ${id} 屬於專案 ${projectId}`);
    }
}
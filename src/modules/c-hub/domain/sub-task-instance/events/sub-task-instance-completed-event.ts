/**
 * 子任務實體完成事件
 * 當子任務實體被標記為完成時發布此事件
 */
export class SubTaskInstanceCompletedEvent {
    constructor(
        public readonly id: string,
        public readonly taskId: string
    ) {
        console.log(`子任務實體已完成: ${id} 屬於任務 ${taskId}`);
    }
}
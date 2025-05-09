/**
 * 子任務實體更新事件
 * 當子任務實體被更新時發布此事件
 */
export class SubTaskInstanceUpdatedEvent {
    constructor(
        public readonly id: string,
        public readonly name: string
    ) {
        console.log(`子任務實體已更新: ${name} (${id})`);
    }
}
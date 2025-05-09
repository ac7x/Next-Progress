/**
 * 子任務實體刪除事件
 * 當子任務實體被刪除時發布此事件
 */
export class SubTaskInstanceDeletedEvent {
    constructor(public readonly id: string) {
        console.log(`子任務實體已刪除: ${id}`);
    }
}
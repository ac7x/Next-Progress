/**
 * 子任務實體創建事件
 * 當新的子任務實體被創建時發布此事件
 */
export class SubTaskInstanceCreatedEvent {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly taskId: string
    ) {
        console.log(`子任務實體已創建: ${name} (${id}) 屬於任務 ${taskId}`);
    }
}
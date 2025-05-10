/**
 * 任務實例創建事件
 * 當新的任務實例被創建時觸發
 */
export class TaskInstanceCreatedEvent {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly projectId: string
    ) {
        console.log(`任務已創建: ${name} (${id}) 屬於專案 ${projectId}`);
    }
}
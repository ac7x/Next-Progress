/**
 * 任務實例刪除事件
 * 當任務實例被刪除時觸發
 */
export class TaskInstanceDeletedEvent {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly projectId: string
    ) {
        console.log(`任務已刪除: ${name} (${id}) 來自專案 ${projectId}`);
    }
}
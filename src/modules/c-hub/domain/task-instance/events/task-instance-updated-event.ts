/**
 * 任務實例更新事件
 * 當任務實例被更新時觸發
 */
export class TaskInstanceUpdatedEvent {
    constructor(
        public readonly id: string,
        public readonly name: string
    ) {
        console.log(`任務已更新: ${name} (${id})`);
    }
}
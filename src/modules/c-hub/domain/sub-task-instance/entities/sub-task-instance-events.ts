export class SubTaskInstanceCreatedEvent {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly taskId: string
    ) {
        console.log(`子任務實體已創建: ${name} (${id}) 屬於任務 ${taskId}`);
    }
}

export class SubTaskInstanceUpdatedEvent {
    constructor(
        public readonly id: string,
        public readonly name: string
    ) {
        console.log(`子任務實體已更新: ${name} (${id})`);
    }
}

export class SubTaskInstanceDeletedEvent {
    constructor(public readonly id: string) {
        console.log(`子任務實體已刪除: ${id}`);
    }
}

export class SubTaskInstanceCompletedEvent {
    constructor(
        public readonly id: string,
        public readonly taskId: string
    ) {
        console.log(`子任務實體已完成: ${id} 屬於任務 ${taskId}`);
    }
}

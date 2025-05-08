export class TaskInstanceCreatedEvent {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly projectId: string
    ) {
        console.log(`任務已創建: ${name} (${id}) 屬於專案 ${projectId}`);
    }
}

export class TaskInstanceUpdatedEvent {
    constructor(
        public readonly id: string,
        public readonly name: string
    ) {
        console.log(`任務已更新: ${name} (${id})`);
    }
}

export class TaskInstanceDeletedEvent {
    constructor(public readonly id: string) {
        console.log(`任務已刪除: ${id}`);
    }
}

export class TaskInstanceCompletedEvent {
    constructor(
        public readonly id: string,
        public readonly projectId: string
    ) {
        console.log(`任務已完成: ${id} 屬於專案 ${projectId}`);
    }
}
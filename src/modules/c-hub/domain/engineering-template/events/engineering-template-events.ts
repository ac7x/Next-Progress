/**
 * 工程模板領域事件 - 代表工程模板生命週期中的重要狀態變化
 * 這些事件可以被其他領域訂閱和處理，實現領域間的鬆耦合通信
 */

// 工程模板創建事件
export class EngineeringTemplateCreatedEvent {
    constructor(
        public readonly templateId: string,
        public readonly name: string
    ) {
        console.log(`工程模板已創建: ${name} (${templateId})`);
    }
}

// 工程模板更新事件
export class EngineeringTemplateUpdatedEvent {
    constructor(
        public readonly templateId: string,
        public readonly name: string
    ) {
        console.log(`工程模板已更新: ${name} (${templateId})`);
    }
}

// 工程模板刪除事件
export class EngineeringTemplateDeletedEvent {
    constructor(public readonly templateId: string) {
        console.log(`工程模板已刪除: ${templateId}`);
    }
}

// 工程模板插入事件 - 記錄從模板創建工程的操作
export class EngineeringTemplateInsertedEvent {
    constructor(
        public readonly templateId: string,
        public readonly projectId: string,
        public readonly engineeringId: string
    ) {
        console.log(`工程模板 ${templateId} 已插入至專案 ${projectId}，創建工程 ${engineeringId}`);
    }
}
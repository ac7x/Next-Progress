// 定義 ProjectInstance 領域事件

export class ProjectInstanceCreatedEvent {
    constructor(public readonly projectId: string, public readonly projectName: string) { }
}

export class ProjectInstanceUpdatedEvent {
    constructor(public readonly projectId: string, public readonly projectName: string) { }
}

export class ProjectInstanceDeletedEvent {
    constructor(public readonly projectId: string) { }
}

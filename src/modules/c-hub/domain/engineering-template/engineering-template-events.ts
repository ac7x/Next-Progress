// 工程模板領域事件

export class EngineeringTemplateCreatedEvent {
  constructor(public readonly templateId: string, public readonly name: string) {
    console.log(`工程模板已創建: ${name} (${templateId})`);
  }
}

export class EngineeringTemplateUpdatedEvent {
  constructor(public readonly templateId: string, public readonly name: string) {
    console.log(`工程模板已更新: ${name} (${templateId})`);
  }
}

export class EngineeringTemplateDeletedEvent {
  constructor(public readonly templateId: string) {
    console.log(`工程模板已刪除: ${templateId}`);
  }
}

export class EngineeringTemplateInsertedEvent {
  constructor(
    public readonly templateId: string,
    public readonly projectId: string,
    public readonly engineeringId: string
  ) {
    console.log(`工程模板 ${templateId} 已插入至專案 ${projectId}，創建工程 ${engineeringId}`);
  }
}

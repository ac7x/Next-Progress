export class ProjectTemplateCreatedEvent {
  constructor(public readonly templateId: string, public readonly templateName: string) {
    // 在實際應用中，這裡會發送事件到事件匯流排或事件存儲
    console.log(`ProjectTemplate created: ${templateName} (${templateId})`);
  }
}

export class ProjectTemplateUpdatedEvent {
  constructor(public readonly templateId: string, public readonly templateName: string) {
    // 在實際應用中，這裡會發送事件到事件匯流排或事件存儲
    console.log(`ProjectTemplate updated: ${templateName} (${templateId})`);
  }
}

export class ProjectTemplateDeletedEvent {
  constructor(public readonly templateId: string) {
    // 在實際應用中，這裡會發送事件到事件匯流排或事件存儲
    console.log(`ProjectTemplate deleted: ${templateId}`);
  }
}

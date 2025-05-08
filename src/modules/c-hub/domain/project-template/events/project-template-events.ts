// 只定義 ProjectTemplate 領域事件
export class ProjectTemplateCreatedEvent {
  constructor(public readonly templateId: string, public readonly templateName: string) { }
}

export class ProjectTemplateUpdatedEvent {
  constructor(public readonly templateId: string, public readonly templateName: string) { }
}

export class ProjectTemplateDeletedEvent {
  constructor(public readonly templateId: string) { }
}

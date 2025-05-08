export class SubTaskTemplateCreatedEvent {
  constructor(public readonly id: string, public readonly name: string, public readonly taskTemplateId: string) {}
}

export class SubTaskTemplateUpdatedEvent {
  constructor(public readonly id: string, public readonly name: string) {}
}

export class SubTaskTemplateDeletedEvent {
  constructor(public readonly id: string) {}
}

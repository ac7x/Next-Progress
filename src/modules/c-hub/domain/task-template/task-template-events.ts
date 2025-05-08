export class TaskTemplateCreatedEvent {
  constructor(public readonly id: string, public readonly name: string) {}
}

export class TaskTemplateUpdatedEvent {
  constructor(public readonly id: string, public readonly name: string) {}
}

export class TaskTemplateDeletedEvent {
  constructor(public readonly id: string) {}
}

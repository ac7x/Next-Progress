export class TagCreatedEvent {
  constructor(public readonly id: string, public readonly name: string) {}
}

export class TagDeletedEvent {
  constructor(public readonly id: string) {}
}

export class TaskTemplateCreatedEvent {
    constructor(public readonly id: string, public readonly name: string) { }
}
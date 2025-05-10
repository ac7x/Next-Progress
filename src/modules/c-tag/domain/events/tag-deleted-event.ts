// src/modules/c-tag/domain/events/tag-deleted-event.ts
import { DomainEvent } from './base-event';

export class TagDeletedEvent extends DomainEvent {
    constructor(public readonly id: string) {
        super();
    }
}
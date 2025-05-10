// src/modules/c-tag/domain/events/tag-created-event.ts
import { TagType } from '@prisma/client';
import { DomainEvent } from './base-event';

export class TagCreatedEvent extends DomainEvent {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly type: TagType
    ) {
        super();
    }
}
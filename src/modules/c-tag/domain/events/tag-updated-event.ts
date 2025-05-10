// src/modules/c-tag/domain/events/tag-updated-event.ts
import { TagType } from '@prisma/client';
import { DomainEvent } from './base-event';

export class TagUpdatedEvent extends DomainEvent {
    constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly type?: TagType,
        public readonly description?: string | null,
        public readonly color?: string | null
    ) {
        super();
    }
}
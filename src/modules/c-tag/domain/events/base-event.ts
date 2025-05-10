// src/modules/c-tag/domain/events/base-event.ts
export abstract class DomainEvent {
    readonly occurredOn: Date;
    
    constructor() {
      this.occurredOn = new Date();
    }
  }
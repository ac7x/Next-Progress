import { TagType } from './tag-entity';

export class TagCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: TagType // 更新為使用 TagType
  ) { }
}

export class TagDeletedEvent {
  constructor(public readonly id: string) { }
}

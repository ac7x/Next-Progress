import { CreateTagProps, Tag, TagType, UpdateTagProps } from './tag-entity';

export interface ITagRepository {
  list(): Promise<Tag[]>;
  listByType(type: TagType): Promise<Tag[]>;
  create(data: CreateTagProps): Promise<Tag>;
  delete(id: string): Promise<void>;
  update(id: string, data: UpdateTagProps): Promise<Tag>;
  getById(id: string): Promise<Tag | null>;
}

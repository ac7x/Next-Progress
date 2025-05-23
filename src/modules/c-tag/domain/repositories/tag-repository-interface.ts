// src/modules/c-tag/domain/repositories/tag-repository-interface.ts
import { CreateTagProps, Tag, TagType, UpdateTagProps } from '../entities/tag-entity';

export interface ITagRepository {
    list(): Promise<Tag[]>;
    listByType(type: TagType): Promise<Tag[]>;
    create(data: CreateTagProps): Promise<Tag>;
    delete(id: string): Promise<void>;
    update(id: string, data: UpdateTagProps): Promise<Tag>;
    getById(id: string): Promise<Tag | null>;
}
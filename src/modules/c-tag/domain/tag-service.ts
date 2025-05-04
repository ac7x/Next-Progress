import { CreateTagProps, Tag, TagType, UpdateTagProps, isValidTag } from './tag-entity';
import { ITagRepository } from './tag-repository';

/**
 * 標籤領域服務接口
 */
export interface ITagDomainService {
  listTags(): Promise<Tag[]>;
  listTagsByType(type: TagType): Promise<Tag[]>;
  createTag(data: CreateTagProps): Promise<Tag>;
  deleteTag(id: string): Promise<void>;
  getTagById(id: string): Promise<Tag | null>;
  updateTag(id: string, data: UpdateTagProps): Promise<Tag>;
}

/**
 * 標籤領域服務實現
 */
export class TagDomainService implements ITagDomainService {
  constructor(private readonly repository: ITagRepository) {}

  async listTags(): Promise<Tag[]> {
    return this.repository.list();
  }

  async listTagsByType(type: TagType): Promise<Tag[]> {
    if (!Object.values(TagType).includes(type)) {
      throw new Error(`無效的標籤類型: ${type}`);
    }
    return this.repository.listByType(type);
  }

  async createTag(data: CreateTagProps): Promise<Tag> {
    if (!data.name?.trim()) {
      throw new Error('標籤名稱不能為空');
    }
    
    const tag = await this.repository.create({
      ...data,
      type: data.type || TagType.GENERAL,
      description: data.description || null
    });
    
    if (!isValidTag(tag)) {
      throw new Error('無效的標籤數據');
    }
    
    return tag;
  }

  async deleteTag(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new Error('標籤ID不能為空');
    }
    
    return this.repository.delete(id);
  }

  async getTagById(id: string): Promise<Tag | null> {
    if (!id?.trim()) {
      throw new Error('標籤ID不能為空');
    }
    
    return this.repository.getById(id);
  }

  async updateTag(id: string, data: UpdateTagProps): Promise<Tag> {
    if (!id?.trim()) {
      throw new Error('標籤ID不能為空');
    }
    
    if (Object.keys(data).length === 0) {
      throw new Error('沒有提供需要更新的屬性');
    }
    
    // 如果嘗試更新標籤名稱，確保它不為空
    if (data.name !== undefined && !data.name.trim()) {
      throw new Error('標籤名稱不能為空');
    }
    
    return this.repository.update(id, data);
  }
}

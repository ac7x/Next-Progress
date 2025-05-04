import { CreateTagProps, Tag, TagType, UpdateTagProps } from './tag-entity';

/**
 * 標籤存儲庫介面
 */
export interface ITagRepository {
  /**
   * 獲取所有標籤
   */
  list(): Promise<Tag[]>;
  
  /**
   * 按類型獲取標籤
   */
  listByType(type: TagType): Promise<Tag[]>;
  
  /**
   * 建立標籤
   */
  create(data: CreateTagProps): Promise<Tag>;
  
  /**
   * 刪除標籤
   */
  delete(id: string): Promise<void>;
  
  /**
   * 更新標籤
   */
  update(id: string, data: UpdateTagProps): Promise<Tag>;
  
  /**
   * 根據ID獲取標籤
   */
  getById(id: string): Promise<Tag | null>;
}

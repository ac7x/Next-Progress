// src/modules/c-tag/application/dto/tag-dto.ts
import { Tag, TagType } from '../../domain/entities/tag-entity';

// 定義資料傳輸物件，用於應用層與介面層之間的數據交換
export interface TagDTO {
    id: string;
    name: string;
    type: TagType;
    description: string | null;
    color: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTagDTO {
    name: string;
    type?: TagType;
    description?: string | null;
    color?: string | null;
}

export interface UpdateTagDTO {
    name?: string;
    type?: TagType;
    description?: string | null;
    color?: string | null;
}

export const tagDTOMapper = {
    toDTO(tag: Tag): TagDTO {
        return {
            id: tag.id,
            name: tag.name,
            type: tag.type,
            description: tag.description,
            color: tag.color,
            createdAt: tag.createdAt,
            updatedAt: tag.updatedAt
        };
    },

    toDTOList(tags: Tag[]): TagDTO[] {
        return tags.map(this.toDTO);
    }
};
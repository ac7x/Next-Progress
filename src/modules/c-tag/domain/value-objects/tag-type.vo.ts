// src/modules/c-tag/domain/value-objects/tag-type.vo.ts
import { TagType } from '@prisma/client';

export class TagTypeValue {
    private readonly value: TagType;

    constructor(type: TagType) {
        if (!Object.values(TagType).includes(type)) {
            throw new Error(`無效的標籤類型: ${type}`);
        }
        this.value = type;
    }

    public getValue(): TagType {
        return this.value;
    }

    public equals(other: TagTypeValue): boolean {
        return this.value === other.value;
    }
}
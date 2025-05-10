// src/modules/c-tag/domain/value-objects/tag-name.vo.ts
export class TagName {
    private readonly value: string;

    constructor(name: string) {
        if (!name || name.trim().length === 0) {
            throw new Error('標籤名稱不能為空');
        }
        if (name.length > 50) {
            throw new Error('標籤名稱不能超過50個字符');
        }
        this.value = name.trim();
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: TagName): boolean {
        return this.value === other.value;
    }
}
// src/modules/c-tag/domain/value-objects/tag-description.vo.ts
export class TagDescription {
    private readonly value: string | null;

    constructor(description: string | null) {
        this.value = description ? description.trim() : null;
    }

    public getValue(): string | null {
        return this.value;
    }

    public equals(other: TagDescription): boolean {
        return this.value === other.value;
    }
}
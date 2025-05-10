// src/modules/c-tag/domain/value-objects/tag-color.vo.ts
export class TagColor {
    private readonly value: string | null;
    private static readonly COLOR_REGEX = /^#([0-9A-Fa-f]{6})$/;

    constructor(color: string | null) {
        if (color && !TagColor.COLOR_REGEX.test(color)) {
            throw new Error('顏色格式必須是有效的 HEX 色碼，例如 #FF5733');
        }
        this.value = color;
    }

    public getValue(): string | null {
        return this.value;
    }

    public equals(other: TagColor): boolean {
        return this.value === other.value;
    }
}
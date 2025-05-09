/**
 * 工程模板描述值物件
 * 負責封裝與驗證工程模板描述的業務規則
 */

export class EngineeringTemplateDescription {
    private constructor(private readonly value: string | null) {
        // 私有建構子，確保只能透過工廠方法建立
    }

    public getValue(): string | null {
        return this.value;
    }

    public static create(description: string | null | undefined): EngineeringTemplateDescription {
        if (description === undefined) {
            return new EngineeringTemplateDescription(null);
        }

        if (description && description.length > 500) {
            throw new Error('工程模板描述不能超過500個字符');
        }

        return new EngineeringTemplateDescription(description);
    }

    public toString(): string {
        return this.value || '';
    }

    public equals(other: EngineeringTemplateDescription): boolean {
        return this.value === other.value;
    }

    public isNull(): boolean {
        return this.value === null;
    }
}
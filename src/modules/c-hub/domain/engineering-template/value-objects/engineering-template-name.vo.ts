/**
 * 工程模板名稱值物件
 * 負責封裝與驗證工程模板名稱的業務規則
 */

export class EngineeringTemplateName {
    private constructor(private readonly value: string) {
        // 私有建構子，確保只能透過工廠方法建立
    }

    public getValue(): string {
        return this.value;
    }

    public static create(name: string): EngineeringTemplateName {
        if (!name || name.trim() === '') {
            throw new Error('工程模板名稱不能為空');
        }

        if (name.length > 100) {
            throw new Error('工程模板名稱不能超過100個字符');
        }

        return new EngineeringTemplateName(name.trim());
    }

    public toString(): string {
        return this.value;
    }

    public equals(other: EngineeringTemplateName): boolean {
        return this.value === other.value;
    }
}
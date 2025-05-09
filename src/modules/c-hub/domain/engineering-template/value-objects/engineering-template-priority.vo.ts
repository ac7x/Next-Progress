/**
 * 工程模板優先級值物件
 * 負責封裝與驗證工程模板優先級的業務規則
 */

export class EngineeringTemplatePriority {
    private constructor(private readonly value: number) {
        // 私有建構子，確保只能透過工廠方法建立
    }

    public getValue(): number {
        return this.value;
    }

    public static create(priority: number | null | undefined): EngineeringTemplatePriority {
        // 預設優先級為0，越小越高
        const validPriority = (priority === null || priority === undefined) ? 0 : priority;

        if (validPriority < 0) {
            throw new Error('工程模板優先級不能為負數');
        }

        return new EngineeringTemplatePriority(validPriority);
    }

    public toString(): string {
        return this.value.toString();
    }

    public equals(other: EngineeringTemplatePriority): boolean {
        return this.value === other.value;
    }

    public isHigher(other: EngineeringTemplatePriority): boolean {
        return this.value < other.value; // 數字越小表示優先級越高
    }
}
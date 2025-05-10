/**
 * 任務模板描述值物件
 * 負責處理描述相關的業務規則與約束
 */
export class TaskTemplateDescription {
  private readonly value: string | null;
  private static readonly MAX_LENGTH = 1000;

  constructor(description: string | null | undefined) {
    // 允許描述為空
    if (!description) {
      this.value = null;
      return;
    }

    // 驗證規則
    if (description.length > TaskTemplateDescription.MAX_LENGTH) {
      throw new Error(`任務模板描述不能超過 ${TaskTemplateDescription.MAX_LENGTH} 個字符`);
    }

    this.value = description.trim();
  }

  /**
   * 獲取描述值
   */
  getValue(): string | null {
    return this.value;
  }

  /**
   * 檢查是否有描述
   */
  hasValue(): boolean {
    return this.value !== null && this.value.length > 0;
  }

  /**
   * 比較兩個描述值物件是否相等
   */
  equals(other: TaskTemplateDescription): boolean {
    return this.value === other.value;
  }
}
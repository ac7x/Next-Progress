/**
 * 工程模板描述值物件 - 封裝工程模板描述相關業務規則
 * 確保工程模板描述符合特定的業務要求，例如長度限制和格式規範
 */

export class EngineeringTemplateDescription {
  private readonly value: string | null;
  private static readonly MAX_LENGTH = 500;

  /**
   * 建構函數 - 驗證並封裝工程模板描述
   * @param description 工程模板描述字串或null
   * @throws 如果描述不符合業務規則，將拋出錯誤
   */
  private constructor(description: string | null) {
    this.validate(description);
    this.value = description;
  }

  /**
   * 靜態工廠方法 - 建立工程模板描述值物件
   * @param description 工程模板描述字串或null
   * @returns 工程模板描述值物件實例
   */
  public static create(description: string | null): EngineeringTemplateDescription {
    return new EngineeringTemplateDescription(description);
  }

  /**
   * 獲取工程模板描述值
   * @returns 工程模板描述字串或null
   */
  getValue(): string | null {
    return this.value;
  }

  /**
   * 驗證工程模板描述是否符合業務規則
   * @param description 待驗證的工程模板描述
   * @throws 如果描述不符合規則，將拋出對應錯誤
   */
  private validate(description: string | null): void {
    if (description !== null && description.length > EngineeringTemplateDescription.MAX_LENGTH) {
      throw new Error(`工程模板描述不能超過${EngineeringTemplateDescription.MAX_LENGTH}個字符`);
    }
  }

  /**
   * 將值物件轉換為原始字串
   * @returns 工程模板描述字串或空字串
   */
  toString(): string {
    return this.value || '';
  }

  /**
   * 比較兩個工程模板描述值物件是否相等
   * @param other 另一個工程模板描述值物件
   * @returns 如果兩個值物件包含相同的值，則返回true
   */
  equals(other: EngineeringTemplateDescription): boolean {
    return this.value === other.value;
  }
}
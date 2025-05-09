/**
 * 工程模板名稱值物件 - 封裝工程模板名稱相關業務規則
 * 確保工程模板名稱符合特定的業務要求，例如長度限制和格式規範
 */

export class EngineeringTemplateName {
  private readonly value: string;
  private static readonly MAX_LENGTH = 100;
  private static readonly MIN_LENGTH = 1;

  /**
   * 建構函數 - 驗證並封裝工程模板名稱
   * @param name 工程模板名稱字串
   * @throws 如果名稱不符合業務規則，將拋出錯誤
   */
  private constructor(name: string) {
    this.validate(name);
    this.value = name;
  }

  /**
   * 靜態工廠方法 - 建立工程模板名稱值物件
   * @param name 工程模板名稱字串
   * @returns 工程模板名稱值物件實例
   */
  public static create(name: string): EngineeringTemplateName {
    return new EngineeringTemplateName(name);
  }

  /**
   * 獲取工程模板名稱值
   * @returns 工程模板名稱字串
   */
  getValue(): string {
    return this.value;
  }

  /**
   * 驗證工程模板名稱是否符合業務規則
   * @param name 待驗證的工程模板名稱
   * @throws 如果名稱不符合規則，將拋出對應錯誤
   */
  private validate(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('工程模板名稱不能為空');
    }

    if (name.length > EngineeringTemplateName.MAX_LENGTH) {
      throw new Error(`工程模板名稱不能超過${EngineeringTemplateName.MAX_LENGTH}個字符`);
    }
    
    if (name.length < EngineeringTemplateName.MIN_LENGTH) {
      throw new Error(`工程模板名稱不能少於${EngineeringTemplateName.MIN_LENGTH}個字符`);
    }
  }

  /**
   * 將值物件轉換為原始字串
   * @returns 工程模板名稱字串
   */
  toString(): string {
    return this.value;
  }

  /**
   * 比較兩個工程模板名稱值物件是否相等
   * @param other 另一個工程模板名稱值物件
   * @returns 如果兩個值物件包含相同的值，則返回true
   */
  equals(other: EngineeringTemplateName): boolean {
    return this.value === other.value;
  }
}
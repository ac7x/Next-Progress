/**
 * 工程模板優先級值物件 - 封裝工程模板優先級相關業務規則
 * 確保工程模板優先級符合特定的業務要求，例如範圍限制和有效性
 */

export class EngineeringTemplatePriority {
  private readonly value: number;
  private static readonly MIN_VALUE = 0;
  private static readonly MAX_VALUE = 10;
  private static readonly DEFAULT_VALUE = 0;

  /**
   * 建構函數 - 驗證並封裝工程模板優先級
   * @param priority 工程模板優先級數值
   * @throws 如果優先級不符合業務規則，將拋出錯誤
   */
  private constructor(priority: number | null | undefined) {
    const validPriority = this.validateAndNormalize(priority);
    this.value = validPriority;
  }

  /**
   * 靜態工廠方法 - 建立工程模板優先級值物件
   * @param priority 工程模板優先級數值，可為null或undefined
   * @returns 工程模板優先級值物件實例
   */
  public static create(priority: number | null | undefined): EngineeringTemplatePriority {
    return new EngineeringTemplatePriority(priority);
  }

  /**
   * 獲取工程模板優先級值
   * @returns 工程模板優先級數值
   */
  getValue(): number {
    return this.value;
  }

  /**
   * 驗證工程模板優先級是否符合業務規則，並標準化輸入值
   * @param priority 待驗證的工程模板優先級
   * @returns 標準化後的優先級值
   * @throws 如果優先級不符合規則，將拋出對應錯誤
   */
  private validateAndNormalize(priority: number | null | undefined): number {
    // 如果優先級為null或undefined，則返回默認值
    if (priority === null || priority === undefined) {
      return EngineeringTemplatePriority.DEFAULT_VALUE;
    }
    
    // 將輸入轉換為整數
    const priorityNum = Math.floor(priority);
    
    // 驗證優先級範圍
    if (priorityNum < EngineeringTemplatePriority.MIN_VALUE) {
      throw new Error(`工程模板優先級不能小於${EngineeringTemplatePriority.MIN_VALUE}`);
    }
    
    if (priorityNum > EngineeringTemplatePriority.MAX_VALUE) {
      throw new Error(`工程模板優先級不能大於${EngineeringTemplatePriority.MAX_VALUE}`);
    }
    
    return priorityNum;
  }

  /**
   * 比較兩個工程模板優先級值物件是否相等
   * @param other 另一個工程模板優先級值物件
   * @returns 如果兩個值物件包含相同的值，則返回true
   */
  equals(other: EngineeringTemplatePriority): boolean {
    return this.value === other.value;
  }
}
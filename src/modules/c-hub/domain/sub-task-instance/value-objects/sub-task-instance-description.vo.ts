/**
 * 子任務實體描述值物件
 * 負責驗證和封裝子任務實體描述
 */
export class SubTaskInstanceDescription {
  private readonly value: string | null;

  /**
   * 建構子任務實體描述值物件
   * @param value 描述值，可為空，若有內容則長度不可超過500
   */
  constructor(value: string | null) {
    if (value && value.length > 500) {
      throw new Error('子任務實體描述長度不可超過500個字符');
    }
    
    this.value = value;
  }

  /**
   * 獲取子任務實體描述值
   */
  getValue(): string | null {
    return this.value;
  }

  /**
   * 判斷描述是否為空
   */
  isEmpty(): boolean {
    return !this.value || this.value.trim().length === 0;
  }
}
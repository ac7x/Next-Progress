/**
 * 子任務實體名稱值物件
 * 負責驗證和封裝子任務實體名稱
 */
export class SubTaskInstanceName {
  private readonly value: string;

  /**
   * 建構子任務實體名稱值物件
   * @param value 名稱值，不可為空且長度必須在1到100之間
   */
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('子任務實體名稱不可為空');
    }
    
    if (value.length > 100) {
      throw new Error('子任務實體名稱長度必須不超過100個字符');
    }
    
    this.value = value.trim();
  }

  /**
   * 獲取子任務實體名稱值
   */
  getValue(): string {
    return this.value;
  }
}
/**
 * 子任務實體優先級值物件
 * 負責驗證和封裝子任務實體優先級
 */
export class SubTaskInstancePriority {
  private readonly value: number;

  /**
   * 建構子任務實體優先級值物件
   * @param value 優先級值，必須是 0（高）、1（中）或 2（低）
   */
  constructor(value: number) {
    if (![0, 1, 2].includes(value)) {
      throw new Error('子任務實體優先級必須為 0（高）、1（中）、2（低）');
    }
    
    this.value = value;
  }

  /**
   * 獲取子任務實體優先級值
   */
  getValue(): number {
    return this.value;
  }

  /**
   * 判斷是否為高優先級
   */
  isHigh(): boolean {
    return this.value === 0;
  }

  /**
   * 判斷是否為中優先級
   */
  isMedium(): boolean {
    return this.value === 1;
  }

  /**
   * 判斷是否為低優先級
   */
  isLow(): boolean {
    return this.value === 2;
  }
}
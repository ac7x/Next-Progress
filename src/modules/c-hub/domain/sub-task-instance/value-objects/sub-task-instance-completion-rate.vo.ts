/**
 * 子任務實體完成率值物件
 * 負責驗證和封裝子任務實體完成率
 */
export class SubTaskInstanceCompletionRate {
  private readonly value: number;

  /**
   * 建構子任務實體完成率值物件
   * @param value 完成率值，必須介於0到100之間
   */
  constructor(value: number) {
    if (value < 0 || value > 100) {
      throw new Error('子任務實體完成率必須介於0到100之間');
    }
    
    this.value = Math.round(value); // 四捨五入到整數
  }

  /**
   * 獲取子任務實體完成率值
   */
  getValue(): number {
    return this.value;
  }

  /**
   * 判斷是否尚未開始
   */
  isNotStarted(): boolean {
    return this.value === 0;
  }

  /**
   * 判斷是否已全部完成
   */
  isComplete(): boolean {
    return this.value === 100;
  }

  /**
   * 判斷是否進行中
   */
  isInProgress(): boolean {
    return this.value > 0 && this.value < 100;
  }
}
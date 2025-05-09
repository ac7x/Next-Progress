/**
 * 工程實例創建事件 - 表示工程實例被成功創建
 * 可被其他模組訂閱並觸發後續流程，例如通知或日誌記錄
 */
export class EngineeringInstanceCreatedEvent {
  /**
   * 建構函數 - 初始化創建事件並記錄基本信息
   * @param instanceId 被創建的工程實例ID
   * @param instanceName 被創建的工程實例名稱
   * @param projectId 關聯的專案ID
   */
  constructor(
    public readonly instanceId: string,
    public readonly instanceName: string,
    public readonly projectId: string
  ) {
    console.log(`工程實例已創建: ${instanceName} (${instanceId}) 於專案 ${projectId}`);
    // 在真實環境中，這裡可能會發布到事件總線或觸發其他服務
  }
}
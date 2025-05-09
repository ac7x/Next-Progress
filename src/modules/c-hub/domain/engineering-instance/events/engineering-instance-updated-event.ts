/**
 * 工程實例更新事件 - 表示工程實例被成功更新
 * 可被其他模組訂閱並觸發後續流程，例如通知或日誌記錄
 */
export class EngineeringInstanceUpdatedEvent {
    /**
     * 建構函數 - 初始化更新事件並記錄基本信息
     * @param instanceId 被更新的工程實例ID
     * @param instanceName 被更新的工程實例名稱
     */
    constructor(
        public readonly instanceId: string,
        public readonly instanceName: string
    ) {
        console.log(`工程實例已更新: ${instanceName} (${instanceId})`);
        // 在真實環境中，這裡可能會發布到事件總線或觸發其他服務
    }
}
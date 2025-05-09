/**
 * 工程實例刪除事件 - 表示工程實例被成功刪除
 * 可被其他模組訂閱並觸發後續流程，例如通知或資源清理
 */
export class EngineeringInstanceDeletedEvent {
    /**
     * 建構函數 - 初始化刪除事件並記錄基本信息
     * @param instanceId 被刪除的工程實例ID
     */
    constructor(
        public readonly instanceId: string
    ) {
        console.log(`工程實例已刪除: ${instanceId}`);
        // 在真實環境中，這裡可能會發布到事件總線或觸發其他服務
    }
}
import { WarehouseCreatedEvent, WarehouseDeletedEvent, WarehouseItemCreatedEvent, WarehouseItemDeletedEvent, domainEventPublisher } from '@/modules/c-stock/domain/events';

/**
 * 註冊倉庫相關的事件處理程序
 */
export function registerWarehouseEventHandlers(): void {
    // 訂閱倉庫創建事件
    domainEventPublisher.subscribe(WarehouseCreatedEvent, (event) => {
        console.log(`[事件處理器] 新倉庫已創建: ${event.warehouse.name}`);
        // 這裡可以添加其他處理邏輯，如：
        // - 發送通知
        // - 同步到其他系統
        // - 更新統計資料
    });

    // 訂閱倉庫刪除事件
    domainEventPublisher.subscribe(WarehouseDeletedEvent, (event) => {
        console.log(`[事件處理器] 倉庫已刪除，ID: ${event.warehouseId}`);
        // 這裡可以添加刪除後的處理邏輯
    });

    // 訂閱倉庫物品創建事件
    domainEventPublisher.subscribe(WarehouseItemCreatedEvent, (event) => {
        console.log(`[事件處理器] 新物品已添加到倉庫: ${event.item.name}`);
        // 這裡可以添加物品創建後的處理邏輯
    });

    // 訂閱倉庫物品刪除事件
    domainEventPublisher.subscribe(WarehouseItemDeletedEvent, (event) => {
        console.log(`[事件處理器] 物品已從倉庫移除，ID: ${event.itemId}`);
        // 這裡可以添加物品刪除後的處理邏輯
    });
}

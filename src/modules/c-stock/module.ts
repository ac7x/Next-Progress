import { registerWarehouseEventHandlers } from './application/event-handlers';

/**
 * 初始化 c-stock 模組
 * - 註冊事件處理器
 * - 設定任何模組級別的配置
 */
export function initializeStockModule(): void {
    // 註冊倉庫相關的事件處理器
    registerWarehouseEventHandlers();

    // 這裡可以添加其他初始化邏輯
    console.log('倉庫模組 (c-stock) 已初始化');
}

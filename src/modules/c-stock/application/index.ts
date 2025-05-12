/**
 * c-stock 模組應用層入口
 * 
 * 統一匯出所有應用層組件，作為對外的乾淨介面
 */

// 匯出服務
export * from './services'; // 只匯出已初始化的 service

// 匯出 Server Actions (命令/查詢)
export * from './commands';
export * from './queries';

// 匯出 DTO
export * from './dto';

export * from './event-handlers';

import { WarehouseInstance } from '@/modules/c-stock/domain/warehouse-entity';
import { WarehouseItem } from '@/modules/c-stock/domain/warehouse-item-entity';

/**
 * 倉庫顯示工具函數集
 */
export const warehouseDisplayUtils = {
  /**
   * 格式化倉庫名稱顯示
   */
  formatWarehouseName(warehouse: WarehouseInstance): string {
    return warehouse.name || '未命名倉庫';
  },

  /**
   * 生成倉庫標識顯示（ID的一部分）
   */
  getWarehouseIdBadge(warehouse: WarehouseInstance): string {
    return warehouse.id.slice(0, 8);
  },

  /**
   * 獲取倉庫物品數量標籤顏色
   */
  getQuantityColor(quantity: number): string {
    if (quantity <= 0) return 'text-red-500';
    if (quantity < 5) return 'text-yellow-500';
    return 'text-green-500';
  },

  /**
   * 格式化物品信息顯示
   */
  formatItemInfo(item: WarehouseItem): string {
    let info = item.name;

    if (item.description) {
      info += ` - ${item.description}`;
    }

    info += ` (數量: ${item.quantity})`;

    return info;
  },

  /**
   * 獲取倉庫物品列表摘要
   */
  getWarehouseItemsSummary(items: WarehouseItem[]): string {
    if (!items.length) return '無物品';

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const itemTypes = new Set(items.map(item => item.name)).size;

    return `${itemTypes} 種物品, 總數量: ${totalQuantity}`;
  },

  /**
   * 格式化數量顯示
   */
  formatQuantity(quantity: number): string {
    return quantity.toString();
  },

  /**
   * 獲取倉庫物品完整名稱
   */
  getItemFullName(item: WarehouseItem, warehouse?: WarehouseInstance | null): string {
    if (warehouse) {
      return `${warehouse.name} - ${item.name}`;
    }
    return item.name;
  },

  /**
   * 依照數量將物品分組
   */
  groupItemsByQuantity(items: WarehouseItem[]): Record<string, WarehouseItem[]> {
    return items.reduce((groups: Record<string, WarehouseItem[]>, item) => {
      const key = item.quantity > 10 ? 'high' : item.quantity > 5 ? 'medium' : 'low';

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(item);
      return groups;
    }, {});
  },

  /**
   * 檢查物品數量是否足夠
   */
  isLowStock(item: WarehouseItem, threshold: number = 5): boolean {
    return item.quantity <= threshold;
  },

  /**
   * 根據數量返回適當的 CSS 類別
   */
  getQuantityColorClass(quantity: number): string {
    if (quantity <= 0) return 'text-red-600';
    if (quantity <= 5) return 'text-orange-500';
    return 'text-green-600';
  },

  /**
   * 截斷描述文本
   */
  truncateDescription(description: string | null, maxLength = 100): string {
    if (!description) return '-';
    return description.length > maxLength
      ? `${description.substring(0, maxLength)}...`
      : description;
  },

  /**
   * 格式化日期
   */
  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString();
  },

  /**
   * 將標籤 ID 數組轉換為易讀的標籤列表
   */
  formatTags(item: WarehouseItem): string {
    if (!item.tags || item.tags.length === 0) return '-';
    return item.tags.join(', ');
  },

  /**
   * 取得項目狀態描述
   */
  getItemStatusText(item: WarehouseItem): string {
    if (item.quantity <= 0) return '缺貨';
    if (item.quantity <= 5) return '庫存低';
    return '庫存充足';
  }
};

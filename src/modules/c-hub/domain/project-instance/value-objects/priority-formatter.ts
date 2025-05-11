/**
 * 優先級格式化工具 - 將數字優先級轉換為描述性標籤
 */
import { Priority } from './priority.vo';

export class PriorityFormatter {
    /**
     * 將優先級轉換為可讀性較高的標籤
     * @param priority 優先級值物件或數字
     * @returns 對應的優先級標籤
     */
    static toLabel(priority: Priority | number): string {
        const value = typeof priority === 'number' ? priority : priority.getValue();

        switch (value) {
            case 0: return '最高優先';
            case 1: return '極高優先';
            case 2: return '非常高';
            case 3: return '高優先';
            case 4: return '中高優先';
            case 5: return '中等';
            case 6: return '中低優先';
            case 7: return '低優先';
            case 8: return '非常低';
            case 9: return '極低優先';
            default: return `未定義 (${value})`;
        }
    }

    /**
     * 根據優先級獲取對應的顏色類別
     * @param priority 優先級值物件或數字
     * @returns 對應的 Tailwind 顏色類別
     */
    static getColorClass(priority: Priority | number): string {
        const value = typeof priority === 'number' ? priority : priority.getValue();

        if (value <= 2) {
            return 'bg-red-500'; // 高優先級 (0-2)
        } else if (value <= 5) {
            return 'bg-yellow-500'; // 中優先級 (3-5)
        } else {
            return 'bg-green-500'; // 低優先級 (6-9)
        }
    }

    /**
     * 根據優先級獲取文字顏色類別
     * @param priority 優先級值物件或數字
     * @returns 對應的 Tailwind 文字顏色類別
     */
    static getTextColorClass(priority: Priority | number): string {
        const value = typeof priority === 'number' ? priority : priority.getValue();

        if (value <= 2) {
            return 'text-red-600'; // 高優先級 (0-2)
        } else if (value <= 5) {
            return 'text-yellow-600'; // 中優先級 (3-5)
        } else {
            return 'text-green-600'; // 低優先級 (6-9)
        }
    }
}
import { AssetEnum, TransactionEnum } from '@prisma/client';

/**
 * 用戶資產服務接口
 * 定義資產領域的核心操作
 */
export interface IUserAssetService {
  /**
   * 獲取用戶資產
   * @param userId - LINE用戶ID
   * @returns 用戶資產對象
   */
  getUserAssets(userId: string): Promise<any>;
  
  /**
   * 初始化用戶資產
   * @param userId - LINE用戶ID
   * @returns 用戶初始化後的資產對象
   */
  initializeUserAssets(userId: string): Promise<any>;
  
  /**
   * 更新用戶資產
   * @param userId - LINE用戶ID
   * @param currency - 資產類型
   * @param amount - 變動數量
   * @param reason - 變動原因
   * @param description - 變動描述
   * @returns 更新後的資產對象
   */
  updateUserAssets(
    userId: string,
    currency: AssetEnum,
    amount: number,
    reason: TransactionEnum,
    description?: string
  ): Promise<any>;
}
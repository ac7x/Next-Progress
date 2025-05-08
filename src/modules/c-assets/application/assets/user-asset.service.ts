import { IUserAssetService } from '@/modules/c-assets/domain/assets/services/user-asset.service.interface';
import { AssetOperation } from '@/modules/c-assets/domain/assets/user-asset.model';
import { userAssetRepository } from '@/modules/c-assets/infrastructure/assets/user-asset.repository';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { AssetEnum, TransactionEnum } from '@prisma/client';

/**
 * 用戶資產服務實現類
 * 實現資產領域的核心業務邏輯
 */
export class UserAssetService implements IUserAssetService {
  /**
   * 獲取用戶資產 - 優化版本
   * @param userId - LINE用戶ID
   * @returns 用戶資產對象
   */
  async getUserAssets(lineUserId: string) {
    try {
      // 先查找用戶
      const user = await prisma.user.findUnique({
        where: { userId: lineUserId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // 使用 upsert 來避免唯一約束衝突
      return await prisma.userAsset.upsert({
        where: {
          userId: user.id
        },
        update: {}, // 如果已存在，不做更新
        create: {
          userId: user.id,
          diamonds: 0,
          hearts: 0,
          bubbles: 0,
          coins: 0,
          extraAssets: {}
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Failed to retrieve user assets: ' + error.message);
      }
      throw new Error('Failed to retrieve user assets: Unknown error');
    }
  }

  /**
   * 初始化用戶資產
   * @param userId - LINE用戶ID
   * @returns 用戶初始化後的資產對象
   */
  async initializeUserAssets(lineUserId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { userId: lineUserId }
      });

      if (!user) {
        throw new Error(`User not found: lineUserId=${lineUserId}`);
      }

      // 使用 upsert 來避免唯一約束衝突
      return await prisma.userAsset.upsert({
        where: {
          userId: user.id
        },
        update: {}, // 如果已存在，不做更新
        create: {
          userId: user.id,
          diamonds: 0,
          hearts: 0,
          bubbles: 0,
          coins: 0,
          extraAssets: {}
        }
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Failed to initialize user assets: ' + error.message);
      }
      throw new Error('Failed to initialize user assets: Unknown error');
    }
  }

  /**
   * 更新用戶資產 - 優化版本，支援基本和擴展資產
   * @param userId - LINE用戶ID
   * @param currency - 資產類型
   * @param amount - 變動數量
   * @param reason - 變動原因
   * @param description - 變動描述
   * @returns 更新後的資產對象
   */
  async updateUserAssets(
    userId: string,
    currency: AssetEnum,
    amount: number,
    reason: TransactionEnum,
    description?: string
  ) {
    try {
      // 從 UserAsset 表查詢，而不是從 User 表
      const userAsset = await prisma.userAsset.findFirst({
        where: {
          user: {
            userId
          }
        }
      });

      // 如果找不到資產記錄，先初始化
      if (!userAsset) {
        await this.initializeUserAssets(userId);
      }

      // 建立資產操作值物件
      const operation = new AssetOperation(currency, amount, reason, description);

      // 驗證操作
      if (!operation.isValid()) {
        throw new Error('Invalid asset operation: amount cannot be zero');
      }

      // 執行資產更新
      return await userAssetRepository.update(userId, operation);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error('Failed to update user assets: ' + error.message);
      }
      throw new Error('Failed to update user assets: Unknown error');
    }
  }
}

// 導出單例實例便於系統使用
export const userAssetService = new UserAssetService();
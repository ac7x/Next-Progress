import { AssetOperation, UserAssetModel, mapToDomainUserAsset } from '@/modules/c-assets/domain/assets/user-asset.model';
import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';
import { AssetEnum } from '@prisma/client';

export class UserAssetRepository {
  /**
   * 尋找用戶資產
   * @param userId 用戶ID
   */
  async findByUserId(userId: string): Promise<UserAssetModel | null> {
    const userAsset = await prisma.userAsset.findUnique({
      where: { userId }
    });

    return userAsset ? mapToDomainUserAsset(userAsset) : null;
  }

  /**
   * 更新資產 - 處理基本和擴展資產
   * @param userId - 用戶ID
   * @param operation - 資產操作值物件
   */
  async update(userId: string, operation: AssetOperation): Promise<UserAssetModel> {
    console.log(`開始資產更新操作: userId=${userId}, currency=${operation.currency}, amount=${operation.amount}`);

    // 使用事務確保資產更新和變動記錄的一致性
    return prisma.$transaction(async (tx) => {
      // 1. 查找現有資產
      const existingAsset = await tx.userAsset.findUnique({
        where: { userId }
      });

      if (!existingAsset) {
        console.log(`找不到用戶資產，建立初始資產: userId=${userId}`);
        // 如果不存在，創建初始資產
        const initialAsset = await tx.userAsset.create({
          data: {
            userId,
            diamonds: operation.currency === AssetEnum.DIAMOND ? operation.amount : 0,
            hearts: operation.currency === AssetEnum.HEART ? operation.amount : 0,
            bubbles: operation.currency === AssetEnum.BUBBLE ? operation.amount : 0,
            coins: operation.currency === AssetEnum.COIN ? operation.amount : 0
          }
        });

        // 記錄變動
        await tx.assetMutation.create({
          data: {
            userId,
            currency: operation.currency,
            amount: operation.amount,
            balance: operation.amount,
            reason: operation.reason,
            description: operation.description
          }
        });

        return mapToDomainUserAsset(initialAsset);
      }

      // 2. 確定要更新的欄位和值
      let fieldToUpdate: string;
      let currentBalance: number;

      // 根據資產類型選擇正確的欄位名稱
      switch (operation.currency) {
        case AssetEnum.DIAMOND:
          fieldToUpdate = 'diamonds';  // 正確的欄位名稱
          currentBalance = existingAsset.diamonds;
          break;
        case AssetEnum.HEART:
          fieldToUpdate = 'hearts';
          currentBalance = existingAsset.hearts;
          break;
        case AssetEnum.BUBBLE:
          fieldToUpdate = 'bubbles';
          currentBalance = existingAsset.bubbles;
          break;
        case AssetEnum.COIN:
          fieldToUpdate = 'coins';
          currentBalance = existingAsset.coins;
          break;
        default:
          throw new Error(`不支援的資產類型: ${operation.currency}`);
      }

      // 3. 計算新餘額
      const newBalance = currentBalance + operation.amount;
      if (newBalance < 0) {
        throw new Error(`資產不足: ${operation.currency}`);
      }

      console.log(`更新資產: userId=${userId}, field=${fieldToUpdate}, currentBalance=${currentBalance}, newBalance=${newBalance}`);

      // 4. 更新資產
      const updated = await tx.userAsset.update({
        where: { userId },
        data: {
          [fieldToUpdate]: newBalance
        }
      });

      // 5. 記錄變動
      await tx.assetMutation.create({
        data: {
          userId,
          currency: operation.currency,
          amount: operation.amount,
          balance: newBalance,
          reason: operation.reason,
          description: operation.description
        }
      });

      console.log(`資產更新成功: userId=${userId}, newBalance=${newBalance}`);
      return mapToDomainUserAsset(updated);
    });
  }

  /**
   * 初始化用戶資產
   * @param userId 用戶ID
   */
  async initializeUserAsset(userId: string): Promise<UserAssetModel> {
    const newUserAsset = await prisma.userAsset.create({
      data: {
        userId,
        diamonds: 0,
        hearts: 0,
        bubbles: 0,
        coins: 0,
        extraAssets: {}
      }
    });

    return mapToDomainUserAsset(newUserAsset);
  }
}

// 導出單例實例
export const userAssetRepository = new UserAssetRepository();
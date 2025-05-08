'use server';

import { userAssetService } from './user-asset.service';
import { AssetEnum, TransactionEnum } from '@prisma/client';

/**
 * 獲取用戶資產的 Server Action
 * @param userId - LINE用戶ID
 * @returns 用戶資產對象
 */
export async function getUserAssets(userId: string) {
  return userAssetService.getUserAssets(userId);
}

/**
 * 更新用戶資產的 Server Action
 * @param userId - LINE用戶ID
 * @param currency - 資產類型
 * @param amount - 變動數量
 * @param reason - 變動原因
 * @param description - 變動描述
 * @returns 更新後的資產對象
 */
export async function updateUserAssets(
  userId: string,
  currency: AssetEnum,
  amount: number,
  reason: TransactionEnum,
  description?: string
) {
  return userAssetService.updateUserAssets(userId, currency, amount, reason, description);
}

/**
 * 初始化用戶資產的 Server Action
 * @param userId - LINE用戶ID
 * @returns 初始化後的資產對象
 */
export async function initializeUserAssets(userId: string) {
  return userAssetService.initializeUserAssets(userId);
}
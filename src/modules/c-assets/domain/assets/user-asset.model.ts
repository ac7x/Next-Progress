import { UserAsset as PrismaUserAsset, AssetEnum, TransactionEnum } from '@prisma/client';

// 領域模型 - 內部業務邏輯使用
export interface UserAssetModel {
  id: string;
  userId: string;
  diamonds: number;
  hearts: number;
  bubbles: number;
  coins: number;
  extraAssets: Record<string, number>; // 擴展資產
  updatedAt: Date;
}

// 資產操作值物件 - 符合 DDD 值物件概念
export class AssetOperation {
  constructor(
    public readonly currency: AssetEnum,
    public readonly amount: number,
    public readonly reason: TransactionEnum,
    public readonly description?: string
  ) {}

  isValid(): boolean {
    return this.amount !== 0;
  }

  // 判斷是否為基本資產類型
  isBasicAssetType(): boolean {
    return ['DIAMOND', 'HEART', 'BUBBLE', 'COIN'].includes(this.currency);
  }
}

// 映射函數 - 將 Prisma 模型轉換為領域模型
export function mapToDomainUserAsset(prismaUserAsset: PrismaUserAsset): UserAssetModel {
  // 確保處理可能為空的情況
  if (!prismaUserAsset) {
    console.warn('傳入的 Prisma 用戶資產物件為空');
    return {
      id: '',
      userId: '',
      diamonds: 0,
      hearts: 0, 
      bubbles: 0,
      coins: 0,
      extraAssets: {},
      updatedAt: new Date()
    };
  }
  
  // 確保欄位名稱正確
  return {
    id: prismaUserAsset.id,
    userId: prismaUserAsset.userId,
    diamonds: prismaUserAsset.diamonds || 0,
    hearts: prismaUserAsset.hearts || 0,
    bubbles: prismaUserAsset.bubbles || 0, 
    coins: prismaUserAsset.coins || 0,
    extraAssets: typeof prismaUserAsset.extraAssets === 'object'
      ? (prismaUserAsset.extraAssets as Record<string, number>)
      : {},
    updatedAt: prismaUserAsset.updatedAt
  };
}

// 映射函數 - 將領域模型轉換為前端 DTO
export function mapToUserAssetDTO(userAsset: UserAssetModel) {
  return {
    diamonds: userAsset.diamonds,
    hearts: userAsset.hearts,
    bubbles: userAsset.bubbles,
    coins: userAsset.coins
  };
}
export interface WarehouseInstance {
  id: string;
  name: string;
  description: string | null;
  location?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWarehouseInstanceProps {
  name: string;
  description?: string | null;
  location?: string | null;
  isActive?: boolean;
}

export interface UpdateWarehouseInstanceProps {
  name?: string;
  description?: string | null;
  location?: string | null;
  isActive?: boolean;
}

// 型別守衛函數
export function isValidWarehouseInstance(warehouse: unknown): warehouse is WarehouseInstance {
  return typeof warehouse === 'object' &&
    warehouse !== null &&
    'id' in warehouse &&
    'name' in warehouse &&
    'createdAt' in warehouse &&
    'updatedAt' in warehouse;
}

export interface WarehouseInstance {
  id: string;
  name: string;
  description: string | null;
  location?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWarehouseInstanceProps {
  name: string;
  description?: string | null;
  location?: string | null;
}

export interface UpdateWarehouseInstanceProps {
  name?: string;
  description?: string | null;
  location?: string | null;
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

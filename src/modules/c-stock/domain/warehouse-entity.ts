export interface Warehouse {
  id: string;
  name: string;
  description: string | null;
  location?: string | null;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWarehouseProps {
  name: string;
  description?: string | null;
  location?: string | null;
  isActive?: boolean;
}

export interface UpdateWarehouseProps {
  name?: string;
  description?: string | null;
  location?: string | null;
  isActive?: boolean;
}

// 型別守衛函數
export function isValidWarehouse(warehouse: unknown): warehouse is Warehouse {
  return typeof warehouse === 'object' && 
    warehouse !== null &&
    'id' in warehouse &&
    'name' in warehouse &&
    'createdAt' in warehouse &&
    'updatedAt' in warehouse;
}

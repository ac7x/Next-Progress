// filepath: /workspaces/Next-Progress/src/modules/c-stock/interfaces/hooks/useWarehouse.ts

'use client';

import {
    addTagToWarehouseItem,
    createManyWarehouseItems,
    createWarehouse,
    createWarehouseItem,
    deleteWarehouse,
    deleteWarehouseItem,
    removeTagFromWarehouseItem,
    updateWarehouse,
    updateWarehouseItem,
    updateWarehouseItemQuantity,
} from '@/modules/c-stock/application/commands';
import {
    CreateWarehouseDTO,
    CreateWarehouseItemDTO,
    UpdateWarehouseDTO,
    UpdateWarehouseItemDTO,
} from '@/modules/c-stock/application/dto';
import {
    getAllWarehouses,
    getItemsByWarehouseId,
    searchWarehouseItems,
} from '@/modules/c-stock/application/queries';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* =========================
   Utilities
========================= */

// 統一 invalidate 倉庫相關快取
function invalidateWarehouses(queryClient: ReturnType<typeof useQueryClient>) {
    queryClient.invalidateQueries({ queryKey: ['warehouses'] });
}

// 統一 invalidate 倉庫物品快取
function invalidateWarehouseItems(queryClient: ReturnType<typeof useQueryClient>, warehouseId?: string) {
    if (warehouseId) {
        queryClient.invalidateQueries({ queryKey: ['warehouseItems', warehouseId] });
    }
}

/* =========================
   Warehouse Queries
========================= */

/**
 * 獲取所有倉庫 Hook
 */
export function useWarehouses() {
    return useQuery({
        queryKey: ['warehouses'],
        queryFn: () => getAllWarehouses(),
    });
}

/* =========================
   WarehouseItem Queries
========================= */

/**
 * 獲取特定倉庫的物品 Hook
 * @param warehouseId 倉庫ID
 */
export function useWarehouseItems(warehouseId: string) {
    return useQuery({
        queryKey: ['warehouseItems', warehouseId],
        queryFn: () => getItemsByWarehouseId(warehouseId),
        enabled: !!warehouseId,
    });
}

/**
 * 搜索倉庫物品 Hook
 * @param query 搜索關鍵詞
 * @param options 搜索選項
 */
export function useSearchWarehouseItems(query: string, options?: { warehouseId?: string; skip?: number; take?: number }) {
    return useQuery({
        queryKey: ['searchWarehouseItems', query, options],
        queryFn: () => searchWarehouseItems(query, options),
        enabled: query.length > 0,
    });
}

/* =========================
   Warehouse Mutations
========================= */

/**
 * 倉庫變更操作 Hook
 */
export function useWarehouseMutations() {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CreateWarehouseDTO) => createWarehouse(data),
        onSuccess: () => invalidateWarehouses(queryClient),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateWarehouseDTO }) => updateWarehouse(id, data),
        onSuccess: () => invalidateWarehouses(queryClient),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteWarehouse(id),
        onSuccess: () => invalidateWarehouses(queryClient),
    });

    return {
        createWarehouse: createMutation,
        updateWarehouse: updateMutation,
        deleteWarehouse: deleteMutation,
    };
}

/**
 * 具名 Hook：建立倉庫
 */
export function useCreateWarehouse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateWarehouseDTO) => createWarehouse(data),
        onSuccess: () => invalidateWarehouses(queryClient),
    });
}

/**
 * 具名 Hook：刪除倉庫
 */
export function useDeleteWarehouse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteWarehouse(id),
        onSuccess: () => invalidateWarehouses(queryClient),
    });
}

/* =========================
   WarehouseItem Mutations
========================= */

/**
 * 倉庫物品變更操作 Hook
 */
export function useWarehouseItemMutations(warehouseId?: string) {
    const queryClient = useQueryClient();

    const invalidateAll = () => {
        invalidateWarehouseItems(queryClient, warehouseId);
        invalidateWarehouses(queryClient);
    };

    const createMutation = useMutation({
        mutationFn: (data: CreateWarehouseItemDTO) => createWarehouseItem(data),
        onSuccess: invalidateAll,
    });

    const createManyMutation = useMutation({
        mutationFn: ({
            items,
            warehouseId: targetWarehouseId,
        }: {
            items: Omit<CreateWarehouseItemDTO, 'warehouseId'>[];
            warehouseId: string;
        }) => createManyWarehouseItems(items, targetWarehouseId),
        onSuccess: invalidateAll,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateWarehouseItemDTO }) =>
            updateWarehouseItem(id, data),
        onSuccess: invalidateAll,
    });

    const updateQuantityMutation = useMutation({
        mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
            updateWarehouseItemQuantity(id, quantity),
        onSuccess: invalidateAll,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteWarehouseItem(id),
        onSuccess: invalidateAll,
    });

    return {
        createWarehouseItem: createMutation,
        createManyWarehouseItems: createManyMutation,
        updateWarehouseItem: updateMutation,
        updateWarehouseItemQuantity: updateQuantityMutation,
        deleteWarehouseItem: deleteMutation,
    };
}

/**
 * 具名 Hook：建立倉庫物品
 */
export function useCreateWarehouseItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateWarehouseItemDTO) => createWarehouseItem(data),
        onSuccess: (_, variables) => {
            // 無效化指定倉庫的物品查詢
            queryClient.invalidateQueries({ queryKey: ['warehouseItems', variables.warehouseId] });
            // 同時無效化所有倉庫查詢，以更新相關計數
            queryClient.invalidateQueries({ queryKey: ['warehouses'] });
        }
    });
}

/**
 * 具名 Hook：刪除倉庫物品
 */
export function useDeleteWarehouseItem() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteWarehouseItem(id),
        onSuccess: () => {
            // 由於我們不知道要刪除哪個倉庫的物品，所以我們無效化所有相關查詢
            queryClient.invalidateQueries({ queryKey: ['warehouseItems'] });
            // 同時無效化所有倉庫查詢，以更新相關計數
            queryClient.invalidateQueries({ queryKey: ['warehouses'] });
        }
    });
}

/* =========================
   WarehouseItem Tag Mutations
========================= */

/**
 * 倉庫物品標籤操作 Hook
 */
export function useWarehouseItemTagMutations() {
    const queryClient = useQueryClient();

    const addTagMutation = useMutation({
        mutationFn: ({ itemId, tagId }: { itemId: string; tagId: string }) =>
            addTagToWarehouseItem(itemId, tagId),
        onSuccess: () => {
            // 無效化所有倉庫物品查詢
            queryClient.invalidateQueries({ queryKey: ['warehouseItems'] });
        }
    });

    const removeTagMutation = useMutation({
        mutationFn: ({ itemId, tagId }: { itemId: string; tagId: string }) =>
            removeTagFromWarehouseItem(itemId, tagId),
        onSuccess: () => {
            // 無效化所有倉庫物品查詢
            queryClient.invalidateQueries({ queryKey: ['warehouseItems'] });
        }
    });

    return {
        addTag: addTagMutation,
        removeTag: removeTagMutation
    };
}

import { ProjectEquipmentStats, getBatchProjectEquipmentStats } from '@/modules/c-hub/application/project-instance/project-instance-equipment-stats-query';
import { useQuery } from '@tanstack/react-query';

/**
 * 查詢多個專案的設備統計信息，包括設備數量、已完成數量和完成率
 * 優化緩存策略，確保數據及時更新
 * 
 * @param projectInstanceIds 專案ID數組
 * @returns 查詢結果
 */
export function useProjectInstanceEquipmentStatsQuery(projectInstanceIds: string[]) {
    return useQuery<Record<string, ProjectEquipmentStats>>({
        queryKey: ['projectInstancesEquipmentStats', projectInstanceIds],
        queryFn: () => getBatchProjectEquipmentStats(projectInstanceIds),
        enabled: projectInstanceIds.length > 0,
        staleTime: 5 * 1000, // 5 秒後視為過期數據，確保數據及時更新
        refetchInterval: 15 * 1000, // 每 15 秒自動重新獲取，增加重新獲取頻率
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true
    });
}

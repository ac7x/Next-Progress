'use server';

import { prisma } from '@/modules/c-shared/infrastructure/persistence/prisma/client';

// 批量查詢多個專案的任務數量
export async function getProjectInstancesTasksCount(projectInstanceIds: string[]): Promise<Record<string, number>> {
  if (!projectInstanceIds || projectInstanceIds.length === 0) return {};

  // 使用 Prisma groupBy 批量查詢
  const result = await prisma.taskInstance.groupBy({
    by: ['projectId'],
    where: { projectId: { in: projectInstanceIds } },
    _count: { id: true },
  });

  // 轉換為 { [projectId]: count }
  const map: Record<string, number> = {};
  for (const row of result) {
    map[row.projectId] = row._count.id;
  }
  // 若有專案沒有任務，補 0
  projectInstanceIds.forEach(id => {
    if (!(id in map)) map[id] = 0;
  });
  return map;
}

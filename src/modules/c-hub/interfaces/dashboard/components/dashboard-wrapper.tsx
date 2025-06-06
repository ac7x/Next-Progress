'use client';

import { TaskInstanceDashboard } from '@/modules/c-hub/interfaces/task-instance/components/task-instance.dashboard.component';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

/**
 * 儀表板包裝元件
 * 將 Server Component 轉換為 Client Component 並提供 React Query 上下文
 */
export function DashboardWrapper() {
    // 每次渲染創建新的 QueryClient 實例，以確保資料隔離
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 15 * 1000, // 降低資料保鮮時間至 15 秒，更快發現過期數據
                refetchOnWindowFocus: true, // 視窗獲得焦點時重新獲取資料
                retry: 2, // 失敗後重試次數
                refetchOnMount: true, // 組件掛載時重新獲取資料
                refetchInterval: 30 * 1000, // 每 30 秒自動刷新一次
                refetchIntervalInBackground: false, // 僅在頁面活躍時進行自動刷新
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <TaskInstanceDashboard />
            {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}

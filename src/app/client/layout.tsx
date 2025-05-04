import { GlobalBottomNav } from '@/modules/c-shared/interfaces/navigation/GlobalBottomNav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-16"> {/* 增加底部間距 */}
      <main>
        {children}
      </main>
      <GlobalBottomNav />
    </div>
  );
}

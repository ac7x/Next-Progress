import Link from 'next/link';

export const GlobalBottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-7xl mx-auto">
        <ul className="flex justify-around items-center h-16">
          <li>
            <Link
              href="/client/dashboard_management"
              className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
            >
              <span className="text-2xl" aria-hidden="true">📊</span>
              <span className="text-xs mt-1">儀表板</span>
            </Link>
          </li>

          <li>
            <Link
              href="/client/instance_management"
              className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
            >
              <span className="text-2xl" aria-hidden="true">📋</span>
              <span className="text-xs mt-1">管理</span>
            </Link>
          </li>

          <li>
            <Link
              href="/client/template_management"
              className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
            >
              <span className="text-2xl" aria-hidden="true">🧩</span>
              <span className="text-xs mt-1">模板</span>
            </Link>
          </li>

          <li>
            <Link
              href="/client/warehouse_instance"
              className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
            >
              <span className="text-2xl" aria-hidden="true">🏬</span>
              <span className="text-xs mt-1">倉庫</span>
            </Link>
          </li>

          <li>
            <Link
              href="/client/tag"
              className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
            >
              <span className="text-2xl" aria-hidden="true">🏷️</span>
              <span className="text-xs mt-1">標籤</span>
            </Link>
          </li>

          <li>
            <Link
              href="/client/profile"
              className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600"
            >
              <span className="text-2xl" aria-hidden="true">👤</span>
              <span className="text-xs mt-1">個人資料</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
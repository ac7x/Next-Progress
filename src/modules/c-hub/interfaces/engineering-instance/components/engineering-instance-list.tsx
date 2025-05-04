'use client';

import { useEngineeringInstancesQuery } from '../hooks/useEngineeringInstancesQuery';

export function EngineeringInstanceList() {
    const { data: engineerings, isLoading, error } = useEngineeringInstancesQuery();

    if (isLoading) return <p className="text-gray-500">載入工程中...</p>;
    if (error) return <p className="text-red-500">工程載入失敗</p>;

    if (!engineerings || engineerings.length === 0) {
        return <p className="text-gray-500">目前沒有工程</p>;
    }

    return (
        <ul className="space-y-2">
            {engineerings.map((eng) => (
                <li key={eng.id} className="p-2 border rounded bg-gray-50">
                    <div className="font-medium">{eng.name}</div>
                    {eng.description && <div className="text-xs text-gray-600">{eng.description}</div>}
                    <div className="text-xs text-gray-400">建立時間：{new Date(eng.createdAt).toLocaleString()}</div>
                </li>
            ))}
        </ul>
    );
}

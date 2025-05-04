'use client';

import { useState } from 'react';
import { useCreateEngineeringInstance } from '../hooks/useCreateEngineeringInstance';

export function EngineeringInstanceCreateForm({ projectId }: { projectId: string }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { mutateAsync, isPending, error } = useCreateEngineeringInstance();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await mutateAsync({ name, description, projectId });
        setName('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="p-2 text-red-600 bg-red-50 rounded border border-red-200">
                    {error instanceof Error ? error.message : '建立工程失敗'}
                </div>
            )}
            <div>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="工程名稱"
                    required
                    className="w-full p-2 border rounded"
                    disabled={isPending}
                />
            </div>
            <div>
                <input
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="描述（可選）"
                    className="w-full p-2 border rounded"
                    disabled={isPending}
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
                disabled={isPending}
            >
                {isPending ? '處理中...' : '建立工程'}
            </button>
        </form>
    );
}

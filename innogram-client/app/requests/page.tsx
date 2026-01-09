'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Request {
    id: string;
    follower: {
        username: string;
        displayName: string;
        avatarUrl?: string;
    };
    createdAt: string;
}

export default function RequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);

    // Загружаем заявки
    useEffect(() => {
        fetch('/api/follows/requests')
            .then((res) => res.json())
            .then((data) => {
                setRequests(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    }, []);

    const handleAccept = async (username: string) => {
        const res = await fetch(`/api/follows/requests/${username}/accept`, {
            method: 'POST',
        });
        if (res.ok) {
            // Убираем из списка
            setRequests((prev) =>
                prev.filter((r) => r.follower.username !== username)
            );
        }
    };

    const handleDecline = async (username: string) => {
        const res = await fetch(`/api/follows/requests/${username}/decline`, {
            method: 'POST',
        });
        if (res.ok) {
            setRequests((prev) =>
                prev.filter((r) => r.follower.username !== username)
            );
        }
    };

    if (loading)
        return <div className="p-10 text-center">Loading requests...</div>;

    return (
        <div className="max-w-xl mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6 text-black">
                Follow Requests 🔔
            </h1>

            {requests.length === 0 ? (
                <p className="text-gray-500">No pending requests.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {requests.map((req) => (
                        <div
                            key={req.id}
                            className="flex items-center justify-between bg-white p-4 rounded shadow border"
                        >
                            <Link
                                href={`/users/${req.follower.username}`}
                                className="flex items-center gap-3"
                            >
                                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                    {req.follower.avatarUrl ? (
                                        <img
                                            src={req.follower.avatarUrl}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full font-bold text-gray-400">
                                            ?
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-black">
                                        {req.follower.displayName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        @{req.follower.username}
                                    </p>
                                </div>
                            </Link>

                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        handleAccept(req.follower.username)
                                    }
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-blue-700"
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() =>
                                        handleDecline(req.follower.username)
                                    }
                                    className="bg-gray-200 text-black px-3 py-1 rounded text-sm font-bold hover:bg-gray-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

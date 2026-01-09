'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Profile {
    username: string;
    avatarUrl?: string;
}

interface User {
    id: string;
    email: string;
    profile?: Profile;
}

export default function ExploreUsersPage() {
    // 2. Типизируем стейт
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // 3. Правильный useEffect (решает проблему "Synchronous setState")
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users?page=1&limit=50');
                if (res.ok) {
                    const data = await res.json();
                    // Учитываем структуру пагинации (items) или массив
                    setUsers(data.items || data);
                }
            } catch (e) {
                console.error('Failed to load users', e);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleFollow = async (username?: string) => {
        if (!username) return;

        try {
            const res = await fetch(`/api/follows/${username}`, {
                method: 'POST',
            });

            // 🔥 Если сервер говорит 409 (Уже есть), мы считаем это успехом
            if (res.status === 409) {
                alert(`You are already following ${username} 👍`);
                // Тут можно было бы обновить стейт, чтобы скрыть кнопку
                return;
            }

            if (res.ok) {
                alert(`✅ Request sent to ${username}!`);
            } else {
                const errData = await res.json();
                alert(`❌ Error: ${errData.message}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="p-10 text-black">Loading...</div>;

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-black">
                Explore Users
            </h1>
            <div className="space-y-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="flex justify-between items-center p-4 bg-white border border-gray-300 rounded shadow-sm"
                    >
                        {/* 👇 2. ОБОРАЧИВАЕМ ЛЕВУЮ ЧАСТЬ В LINK */}
                        <Link
                            href={`/users/${user.profile?.username}`}
                            className="flex items-center gap-3 flex-1 hover:opacity-70 transition cursor-pointer"
                        >
                            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border border-gray-400">
                                {user.profile?.avatarUrl ? (
                                    <img
                                        src={user.profile.avatarUrl}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                        ?
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-black">
                                    {user.profile?.username || (
                                        <span className="text-red-500 text-xs">
                                            No Profile
                                        </span>
                                    )}
                                </p>
                                <p className="text-xs text-gray-600">
                                    {user.email}
                                </p>
                            </div>
                        </Link>
                        {/* 👆 КОНЕЦ LINK */}

                        <button
                            onClick={(e) => {
                                e.preventDefault(); // На всякий случай, чтобы клик не ушел в ссылку (хотя они разделены)
                                handleFollow(user.profile?.username);
                            }}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 text-sm font-bold border border-blue-200 ml-4"
                        >
                            Follow
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

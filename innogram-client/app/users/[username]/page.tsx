'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
    username: string;
    displayName: string;
    bio?: string;
    avatarUrl?: string;
    followersCount?: number;
    followingCount?: number;
}

export default function PublicProfilePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const router = useRouter();
    const [username, setUsername] = useState<string>('');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Стейт для статуса кнопки: 'none' (не подписан), 'pending' (заявка), 'following' (подписан)
    const [followStatus, setFollowStatus] = useState<
        'none' | 'pending' | 'following'
    >('none');

    // Распаковка params
    useEffect(() => {
        params.then((p) => {
            setUsername(p.username);
            fetchProfile(p.username);
        });
    }, [params]);

    const fetchProfile = async (uName: string) => {
        try {
            // 1. Грузим сам профиль
            const res = await fetch(`/api/profiles/${uName}`);
            if (res.ok) {
                const data = await res.json();
                setProfile(data);

                // 🔥 2. ВАЖНО: Сразу проверяем статус подписки!
                // Без этого кнопка будет забывать состояние после F5
                try {
                    const statusRes = await fetch(
                        `/api/follows/${uName}/status`,
                    );
                    if (statusRes.ok) {
                        const statusData = await statusRes.json();
                        console.log('Follow status:', statusData); // Отладка

                        // Обновляем кнопку
                        if (statusData.status === 'accepted')
                            setFollowStatus('following');
                        else if (statusData.status === 'pending')
                            setFollowStatus('pending');
                        else setFollowStatus('none');
                    }
                } catch (err) {
                    console.error('Failed to fetch follow status', err);
                }
            } else {
                setProfile(null);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleMessage = async () => {
        if (!profile) return;
        try {
            // Пытаемся создать чат (или получить существующий)
            const res = await fetch('/api/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetUsername: profile.username }),
            });

            if (res.ok) {
                // Если успех — перекидываем пользователя в раздел сообщений
                router.push('/chats');
            } else {
                alert('Error starting chat');
            }
        } catch (e) {
            console.error('Chat creation error', e);
        }
    };

    // Логика ПОДПИСКИ
    const handleFollow = async () => {
        if (!profile) return;
        try {
            const res = await fetch(`/api/follows/${profile.username}`, {
                method: 'POST',
            });
            if (res.ok) {
                const data = await res.json();

                if (data.status === 'pending') {
                    setFollowStatus('pending');
                    alert('🔒 Request sent! Waiting for approval.');
                } else {
                    setFollowStatus('following');
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    // отписка
    const handleUnfollow = async () => {
        if (!profile) return;
        try {
            const res = await fetch(`/api/follows/${profile.username}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setFollowStatus('none'); // Сбрасываем статус
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Умная кнопка
    const renderFollowButton = () => {
        if (followStatus === 'following') {
            return (
                <button
                    onClick={handleUnfollow}
                    className="bg-gray-200 text-black px-6 py-2 rounded-full font-bold hover:bg-gray-300 transition"
                >
                    Unfollow
                </button>
            );
        }

        if (followStatus === 'pending') {
            return (
                <button
                    disabled
                    className="bg-gray-400 text-white px-6 py-2 rounded-full font-bold cursor-not-allowed"
                >
                    ⏳ Requested
                </button>
            );
        }

        return (
            <button
                onClick={handleFollow}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition"
            >
                Follow
            </button>
        );
    };

    if (loading)
        return <div className="p-10 text-black">Loading profile...</div>;

    if (!profile)
        return (
            <div className="p-10 text-center">
                <h1 className="text-2xl font-bold text-red-500">
                    User not found 404
                </h1>
                <p className="text-gray-600">
                    The user {username} does not exist.
                </p>
            </div>
        );

    return (
        <div className="max-w-lg mx-auto bg-white border border-gray-300 rounded shadow-sm p-8 text-center mt-10">
            <div className="flex justify-center mb-4">
                <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow">
                    {profile.avatarUrl ? (
                        <img
                            src={profile.avatarUrl}
                            className="w-full h-full object-cover"
                            alt="avatar"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl">
                            ?
                        </div>
                    )}
                </div>
            </div>

            <h1 className="text-2xl font-bold text-black">
                {profile.displayName}
            </h1>
            <p className="text-blue-600 font-medium mb-4">
                @{profile.username}
            </p>

            {profile.bio && (
                <p className="text-gray-800 italic mb-6">{profile.bio}</p>
            )}

            {/* 🔥 4. ОБНОВЛЕННЫЙ БЛОК КНОПОК */}
            <div className="mb-6 flex justify-center gap-3">
                {renderFollowButton()}

                <button
                    onClick={handleMessage}
                    className="bg-white border border-gray-300 text-black px-6 py-2 rounded-full font-bold hover:bg-gray-50 transition shadow-sm"
                >
                    Message 💬
                </button>
            </div>

            <div className="flex justify-center gap-8 text-sm text-gray-600 border-t pt-4">
                <div>
                    <span className="font-bold text-black">
                        {profile.followersCount || 0}
                    </span>{' '}
                    followers
                </div>
                <div>
                    <span className="font-bold text-black">
                        {profile.followingCount || 0}
                    </span>{' '}
                    following
                </div>
            </div>
        </div>
    );
}

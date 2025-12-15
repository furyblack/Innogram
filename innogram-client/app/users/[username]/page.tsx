'use client';
import { useState, useEffect, use } from 'react'; // Импорт use для Next.js 13+ params

// Типизация (можно вынести, но пока тут)
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
    // В Next.js 15 params это Promise, поэтому используем use() или useEffect
    const [username, setUsername] = useState<string>('');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Распаковка params
    useEffect(() => {
        params.then((p) => {
            setUsername(p.username);
            fetchProfile(p.username);
        });
    }, [params]);

    const fetchProfile = async (uName: string) => {
        try {
            // Эндпоинт PublicProfileController: GET /api/profiles/:username
            const res = await fetch(`/api/profiles/${uName}`);
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            } else {
                setProfile(null);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        if (!username) return;
        const res = await fetch(`/api/users/${username}/follow`, {
            method: 'POST',
        });
        if (res.ok) alert(`Followed ${username}!`);
        else alert('Error following');
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

            <button
                onClick={handleFollow}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition"
            >
                Follow
            </button>

            {/* Сюда можно добавить список постов этого юзера, если на бэке появится эндпоинт getPostsByUsername */}
        </div>
    );
}

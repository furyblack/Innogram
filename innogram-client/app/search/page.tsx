'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import PostCard from '../components/PostCard'; // Убедись в пути импорта
import { Post, Profile } from '../types';

// Хук для отложенного поиска (чтобы не долбить сервер на каждую букву)
function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500); // Поиск начнется через 500мс после остановки ввода
    const [activeTab, setActiveTab] = useState<'posts' | 'people'>('posts');

    const [posts, setPosts] = useState<Post[]>([]);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!debouncedQuery) {
            setPosts([]);
            setProfiles([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'posts') {
                    // Используем наш исправленный эндпоинт
                    const res = await fetch(
                        `/api/posts/search?q=${debouncedQuery}`
                    );
                    if (res.ok) setPosts(await res.json());
                } else {
                    // Используем эндпоинт поиска людей
                    const res = await fetch(
                        `/api/profiles/search?q=${debouncedQuery}`
                    );
                    if (res.ok) setProfiles(await res.json());
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [debouncedQuery, activeTab]);

    return (
        <div className="max-w-2xl mx-auto mt-6">
            <h1 className="text-3xl font-bold mb-6 text-black">Search</h1>

            {/* Поле ввода */}
            <input
                type="text"
                placeholder="Search for people or posts..."
                className="w-full border p-3 rounded-lg shadow-sm text-lg text-black mb-6"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
            />

            {/* Переключатель вкладок */}
            <div className="flex border-b mb-6">
                <button
                    className={`pb-2 px-4 font-medium ${activeTab === 'posts' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('posts')}
                >
                    📝 Posts
                </button>
                <button
                    className={`pb-2 px-4 font-medium ${activeTab === 'people' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('people')}
                >
                    👥 People
                </button>
            </div>

            {/* Результаты */}
            {loading && (
                <div className="text-gray-500 text-center">Searching... 🔎</div>
            )}

            {!loading && activeTab === 'posts' && (
                <div>
                    {posts.length === 0 && debouncedQuery && (
                        <p className="text-gray-500">No posts found.</p>
                    )}
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}

            {!loading && activeTab === 'people' && (
                <div className="flex flex-col gap-4">
                    {profiles.length === 0 && debouncedQuery && (
                        <p className="text-gray-500">No people found.</p>
                    )}
                    {profiles.map((profile) => (
                        <Link
                            key={profile.id}
                            href={`/users/${profile.username}`}
                            className="flex items-center gap-4 p-4 bg-white border rounded shadow-sm hover:bg-gray-50 transition"
                        >
                            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                {profile.avatarUrl ? (
                                    <img
                                        src={profile.avatarUrl}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full font-bold text-gray-400">
                                        ?
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-black">
                                    {profile.displayName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    @{profile.username}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

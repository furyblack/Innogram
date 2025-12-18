'use client';
import { useState, useEffect } from 'react';
import PostCard from '../components/PostCard'; // Убедись, что путь верный
import Link from 'next/link';
import { Post } from '../types';

export default function FeedPage() {
    // 2. Используем тип Post[] вместо any[]
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // 3. ИСПРАВЛЕННЫЙ useEffect
    useEffect(() => {
        // Объявляем функцию ВНУТРИ эффекта
        const fetchFeed = async () => {
            try {
                const res = await fetch('/api/posts/feed?page=1&limit=20');
                if (res.ok) {
                    const data = await res.json();
                    // Учитываем, что бэк может вернуть { items: [], meta: {} } или просто []
                    setPosts(data.items || data);
                }
            } catch (e) {
                console.error('Failed to load feed', e);
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []); // Пустой массив зависимостей = запуск 1 раз при старте

    // Функция для кнопки Refresh (вынесли отдельно от useEffect)
    const handleRefresh = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/posts?page=1&limit=20');
            if (res.ok) {
                const data = await res.json();
                setPosts(data.items || data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-black">News Feed</h1>
                <Link
                    href="/posts/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-medium"
                >
                    + New Post
                </Link>
            </div>

            <button
                onClick={handleRefresh}
                className="mb-4 text-blue-600 hover:text-blue-800 underline text-sm font-medium"
            >
                Refresh
            </button>

            {loading && <p className="text-gray-600">Loading posts...</p>}

            {!loading && posts.length === 0 && (
                <p className="text-gray-600">No posts found.</p>
            )}

            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}

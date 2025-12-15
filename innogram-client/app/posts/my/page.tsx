'use client';
import { useState, useEffect } from 'react';
import PostCard from '../../components/PostCard';
import { Post } from '@/app/types';



export default function MyPostsPage() {
    // 2. Используем Post[] вместо any[]
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // 3. Переносим функцию загрузки ВНУТРЬ useEffect
    useEffect(() => {
        const loadMyPosts = async () => {
            try {
                const res = await fetch('/api/posts/my?page=1&limit=50');
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

        loadMyPosts();
    }, []);

    const handlePostDelete = (deletedId: string) => {
        setPosts(posts.filter((p) => p.id !== deletedId));
    };

    if (loading) return <div className="p-10 text-black">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-black mb-6">My Posts</h1>

            {posts.length === 0 && (
                <p className="text-gray-600">
                    {/* 4. Исправляем апостроф: используем &apos; */}
                    You haven&apos;t posted anything yet.
                </p>
            )}

            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    isMyPost={true}
                    onDelete={handlePostDelete}
                />
            ))}
        </div>
    );
}

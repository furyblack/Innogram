'use client';
import { useState } from 'react';

// 1. Описываем минимальный интерфейс поста, чтобы не использовать any
interface Post {
    id: string;
    title?: string;
    content: string;
    profile?: {
        id: string;
    };
}

export default function FeedPage() {
    // 2. Используем этот тип в useState
    const [posts, setPosts] = useState<Post[]>([]);

    const loadFeed = async () => {
        // Стучимся на /api/posts/feed -> Прокси перешлет на Core Service
        const res = await fetch('/api/posts/feed');
        if (res.ok) {
            const data = await res.json();
            setPosts(data);
        } else {
            alert('Error loading feed (Not authorized?)');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Your Feed</h1>
                <button
                    onClick={loadFeed}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    🔄 Load Posts
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {posts.length === 0 && (
                    <p className="text-gray-500">
                        No posts loaded or feed is empty.
                    </p>
                )}

                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="border p-4 rounded bg-gray-50"
                    >
                        <h3 className="font-bold text-lg">{post.title}</h3>
                        <p>{post.content}</p>
                        <div className="text-sm text-gray-400 mt-2">
                            Author ID: {post.profile?.id}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

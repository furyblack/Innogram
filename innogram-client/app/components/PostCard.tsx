'use client';
import { useState } from 'react';
// Импортируем тип Post из feed page или описываем заново
// (Лучше вынести типы в отдельный файл types.ts, но пока опишем тут для простоты)

interface Comment {
    id: string;
    content: string;
    author: {
        email?: string;
        profile?: {
            username: string;
            displayName: string;
        };
    };
}

// Типизируем пропсы компонента
interface PostProps {
    post: {
        id: string;
        title: string;
        content: string;
        imageUrl?: string;
        likesCount: number;
        author: {
            profile?: {
                username: string;
                displayName: string;
                avatarUrl?: string;
            };
        };
    };
}

export default function PostCard({ post }: PostProps) {
    const [likes, setLikes] = useState(post.likesCount || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');

    // Типизируем список комментариев
    const [commentsList, setCommentsList] = useState<Comment[]>([]);

    // --- ЛАЙКИ ---
    const handleLike = async () => {
        const method = isLiked ? 'DELETE' : 'POST';
        try {
            const res = await fetch(`/api/posts/${post.id}/likes`, { method });
            if (res.ok) {
                setIsLiked(!isLiked);
                setLikes(isLiked ? likes - 1 : likes + 1);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // --- ЗАГРУЗКА КОММЕНТОВ ---
    const loadComments = async () => {
        if (showComments) {
            setShowComments(false);
            return;
        }
        try {
            const res = await fetch(
                `/api/posts/${post.id}/comments?page=1&limit=10`
            );
            if (res.ok) {
                const data = await res.json();
                setCommentsList(data.items || data);
                setShowComments(true);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // --- ОТПРАВКА КОММЕНТА ---
    const sendComment = async () => {
        if (!commentText.trim()) return;

        try {
            const res = await fetch(`/api/posts/${post.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: commentText }),
            });

            if (res.ok) {
                const newComment = await res.json();
                setCommentsList([...commentsList, newComment]);
                setCommentText('');
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="border border-gray-300 rounded bg-white mb-6 shadow-sm overflow-hidden">
            {/* HEADER */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                    {post.author?.profile?.avatarUrl ? (
                        <img
                            src={post.author.profile.avatarUrl}
                            className="w-full h-full object-cover"
                            alt="avatar"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                            ?
                        </div>
                    )}
                </div>
                <div>
                    <p className="font-bold text-sm text-black">
                        {post.author?.profile?.displayName || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-600">
                        @{post.author?.profile?.username || 'user'}
                    </p>
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-4">
                <h3 className="font-bold text-lg text-black mb-2">
                    {post.title}
                </h3>
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                </p>
                {post.imageUrl && (
                    <img
                        src={post.imageUrl}
                        alt="Post"
                        className="mt-3 w-full rounded border border-gray-200"
                    />
                )}
            </div>

            {/* ACTIONS */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 flex gap-4">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 font-medium ${isLiked ? 'text-red-600' : 'text-gray-700'}`}
                >
                    {isLiked ? '❤️' : '🤍'} {likes} Likes
                </button>

                <button
                    onClick={loadComments}
                    className="text-gray-700 font-medium hover:text-blue-600"
                >
                    💬 Comments
                </button>
            </div>

            {/* COMMENTS SECTION */}
            {showComments && (
                <div className="p-4 bg-gray-100 border-t border-gray-200">
                    <div className="flex gap-2 mb-4">
                        <input
                            className="border border-gray-400 p-2 rounded flex-1 text-sm text-black placeholder-gray-600"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button
                            onClick={sendComment}
                            className="bg-blue-600 text-white px-4 rounded text-sm hover:bg-blue-700"
                        >
                            Send
                        </button>
                    </div>

                    <div className="space-y-2">
                        {commentsList.map((c) => (
                            <div
                                key={c.id}
                                className="text-sm bg-white p-3 rounded border border-gray-300 text-gray-900 shadow-sm"
                            >
                                <span className="font-bold mr-2 text-black">
                                    {c.author?.profile?.username ||
                                        c.author?.email ||
                                        'User'}
                                    :
                                </span>
                                {c.content}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

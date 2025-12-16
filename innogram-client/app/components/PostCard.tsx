'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Post } from '../types';

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

interface PostProps {
    post: Post;
    isMyPost?: boolean;
    onDelete?: (id: string) => void;
}

export default function PostCard({ post, isMyPost, onDelete }: PostProps) {
    const [likes, setLikes] = useState(post.likesCount || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [commentsList, setCommentsList] = useState<Comment[]>([]);
    //  Стейты для редактирования
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(post.content);

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

    const handleDelete = async () => {
        // Спрашиваем подтверждение
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const res = await fetch(`/api/posts/${post.id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                alert('Deleted!');
                // Если родитель передал функцию onDelete, вызываем её, чтобы убрать пост из списка
                if (onDelete) onDelete(post.id);
            } else {
                alert('Failed to delete');
            }
        } catch (e) {
            console.error(e);
            alert('Network error');
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

    const handleUpdate = async () => {
        try {
            const res = await fetch(`/api/posts/${post.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }), // Шлем новый текст
            });

            if (res.ok) {
                setIsEditing(false); // Выходим из режима редактирования
                alert('Post updated!');
            } else {
                alert('Failed to update');
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="border border-gray-300 rounded bg-white mb-6 shadow-sm overflow-hidden">
            {/* HEADER */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                {/* Ссылка на профиль автора */}
                <Link
                    href={`/users/${post.profile.username}`}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded transition"
                >
                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                        {post.profile.avatarUrl ? (
                            <img
                                src={post.profile?.avatarUrl}
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
                            {post.profile?.displayName || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-600">
                            @{post.profile?.username || 'user'}
                        </p>
                    </div>
                </Link>

                {isMyPost && !isEditing && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-blue-500 text-xs border border-blue-200 p-1 rounded hover:bg-blue-50"
                        >
                            ✏️ Edit
                        </button>
                        <button
                            onClick={handleDelete} // Твой старый handleDelete
                            className="text-red-500 text-xs border border-red-200 p-1 rounded hover:bg-red-50"
                        >
                            🗑 Delete
                        </button>
                    </div>
                )}
            </div>

            {/* ... CONTENT (title, content, image) ... */}
            <div className="p-4">
                <h3 className="font-bold text-lg text-black mb-2">
                    {post.title}
                </h3>

                {/* 🔥 NEW: Логика переключения Text / Textarea */}
                {isEditing ? (
                    <div className="mb-3">
                        <textarea
                            className="w-full border border-blue-300 p-2 rounded text-black min-h-[100px]"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={handleUpdate}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setContent(post.content); // Сброс при отмене
                                }}
                                className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                        {content}{' '}
                        {/* Показываем стейт content, чтобы он обновился сразу после сохранения */}
                    </p>
                )}

                {post.imageUrl && (
                    <img
                        src={
                            post.imageUrl.startsWith('http')
                                ? post.imageUrl
                                : `http://localhost:3001/${post.imageUrl}`
                        }
                        alt="Post"
                        className="mt-3 w-full rounded border border-gray-200 object-cover max-h-96"
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

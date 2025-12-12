'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePostPage() {
    const [content, setContent] = useState('');
    const [title, setTitle] = useState(''); // Если есть в DTO
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    // 1. Загрузка картинки (сразу при выборе)
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);

        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const res = await fetch('/api/assets/upload', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                // Сохраняем URL, чтобы показать превью и потом отправить на бэк
                // (Зависит от того, принимает ли твой CreatePostDto поле imageUrl или assetId)
                setImageUrl(data.url);
            } else {
                alert('Failed to upload image');
            }
        } catch (error) {
            console.error(error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    // 2. Создание поста
    const handleSubmit = async () => {
        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    // Если твой DTO поддерживает картинки, добавь поле здесь.
                    // Например: imageUrl: imageUrl
                    // Или если картинки нет в DTO, можно временно добавить ссылку в текст:
                    // content: `${content} \n\n ![image](${imageUrl})`
                }),
            });

            if (res.ok) {
                alert('Post created! 🎉');
                router.push('/feed'); // Обратно в ленту
            } else {
                alert('Failed to create post');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow border border-gray-200">
            <h1 className="text-2xl font-bold mb-4">Create New Post</h1>

            {/* Title */}
            <input
                className="w-full border border-gray-400 p-2 rounded mb-4 text-black placeholder-gray-600 font-medium"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            {/* Content */}
            <textarea
                className="w-full border border-gray-400 p-2 rounded mb-4 h-32 text-black placeholder-gray-600"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            {/* Image Upload */}
            <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                    Attach Image:
                </label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                />
                {uploading && (
                    <p className="text-sm text-blue-500">Uploading...</p>
                )}

                {imageUrl && (
                    <div className="mt-2">
                        <p className="text-xs text-green-600 mb-1">
                            Image ready!
                        </p>
                        <img
                            src={imageUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded"
                        />
                    </div>
                )}
            </div>

            <button
                onClick={handleSubmit}
                disabled={uploading}
                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
                Publish Post 🚀
            </button>
        </div>
    );
}

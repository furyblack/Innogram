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
                console.log('Upload response:', data);
                // Сохраняем URL, чтобы показать превью и потом отправить на бэк
                // (Зависит от того, принимает ли твой CreatePostDto поле imageUrl или assetId)
                const serverPath = data.url || data.path || data.filename;
                setImageUrl(serverPath);
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
                    imageUrl,
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
            <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-black">
                    Attach Image:
                </label>

                {/* 🔥 ВОТ ЭТОТ НОВЫЙ ИНПУТ */}
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100 cursor-pointer"
                />

                {/* Состояние загрузки */}
                {uploading && (
                    <p className="text-sm text-blue-500 mt-2 animate-pulse">
                        Uploading...
                    </p>
                )}

                {/* Превью картинки */}
                {imageUrl && (
                    <div className="mt-4 border border-gray-200 p-2 rounded bg-gray-50">
                        <p className="text-xs text-green-600 mb-1 font-bold">
                            ✅ Image ready!
                        </p>
                        {/* Добавляем localhost если нужно, чтобы картинка не билась */}
                        <img
                            src={
                                imageUrl.startsWith('http')
                                    ? imageUrl
                                    : `http://localhost:3001/${imageUrl}`
                            }
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

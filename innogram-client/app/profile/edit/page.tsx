'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // Поля формы
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    const [isPrivate, setIsPrivate] = useState(false);

    // Загрузка текущих данных
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile/me'); // Твой эндпоинт "Я"
                if (res.ok) {
                    const data = await res.json();
                    setDisplayName(data.displayName || '');
                    setBio(data.bio || '');
                    setAvatarUrl(data.avatarUrl || '');
                    setIsPrivate(data.isPrivate || false);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // Загрузка новой аватарки
    const handleAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files?.length) return;
        const formData = new FormData();
        formData.append('file', e.target.files[0]);

        try {
            const res = await fetch('/api/assets/upload', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                // Сохраняем URL (или добавляем localhost:3001, если бэк вернул имя)
                const url = data.url || data.path || data.filename;
                // Простая проверка, чтобы добавить хост если его нет
                setAvatarUrl(
                    url.startsWith('http')
                        ? url
                        : `http://localhost:3001/${url}`
                );
            }
        } catch (e) {
            alert('Error uploading avatar');
        }
    };

    // Сохранение изменений
    const handleSave = async () => {
        try {
            const res = await fetch('/api/profile/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    displayName,
                    bio,
                    avatarUrl,
                    isPrivate,
                }),
            });

            if (res.ok) {
                alert('Profile updated! ✅');
                router.push('/profile/me');
            } else {
                alert('Error updating profile');
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow border">
            <h1 className="text-2xl font-bold mb-6 text-black">Edit Profile</h1>

            {/* Аватарка */}
            <div className="mb-6 text-center">
                <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full overflow-hidden mb-2 border">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            ?
                        </div>
                    )}
                </div>
                <label className="block">
                    <span className="sr-only">Choose profile photo</span>
                    <input
                        type="file"
                        onChange={handleAvatarChange}
                        className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100
                          cursor-pointer mx-auto max-w-[250px]"
                    />
                </label>
            </div>

            {/* Имя */}
            <div className="mb-4">
                <label className="block text-sm font-bold mb-1 text-black">
                    Display Name
                </label>
                <input
                    className="w-full border p-2 rounded text-black"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                />
            </div>

            {/* Био */}
            <div className="mb-6">
                <label className="block text-sm font-bold mb-1 text-black">
                    Bio
                </label>
                <textarea
                    className="w-full border p-2 rounded text-black h-24"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell something about yourself..."
                />
            </div>

            <div className="mb-6 flex items-center gap-3 p-3 border rounded bg-gray-50">
                <input
                    type="checkbox"
                    id="isPrivate"
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <label
                    htmlFor="isPrivate"
                    className="cursor-pointer select-none"
                >
                    <span className="block font-bold text-black">
                        Private Account
                    </span>
                    <span className="text-xs text-gray-500">
                        Only approved followers can see your posts.
                    </span>
                </label>
            </div>

            <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700"
            >
                Save Changes
            </button>
        </div>
    );
}

'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Описываем, как выглядит наш профиль (чтобы TypeScript не ругался)
interface Profile {
    id: string;
    username: string;
    displayName: string;
    bio?: string;
    avatarUrl?: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // 1. ЗАГРУЗКА ПРОФИЛЯ ПРИ СТАРТЕ
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // Стучимся в Core Service через Next.js прокси
            const res = await fetch('/api/profile/me');

            if (res.status === 401) {
                alert('Please login first');
                router.push('/auth');
                return;
            }

            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (e) {
            console.error('Error fetching profile', e);
        } finally {
            setLoading(false);
        }
    };

    // 2. ЛОГИКА ЗАГРУЗКИ АВАТАРКИ
    const handleAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file); // Имя поля 'file' должно совпадать с тем, что в Multer (Controller)

        try {
            // ШАГ А: Загружаем картинку на сервер ассетов
            const uploadRes = await fetch('/api/assets/upload', {
                method: 'POST',
                body: formData, // Браузер сам выставит нужные заголовки для FormData
            });

            if (!uploadRes.ok) {
                alert('Failed to upload image');
                return;
            }

            const assetData = await uploadRes.json();
            const newAvatarUrl = assetData.url; // Получаем публичную ссылку (http://localhost:3001/uploads/...)

            console.log('Uploaded! New URL:', newAvatarUrl);

            // ШАГ Б: Обновляем профиль пользователя новой ссылкой
            const patchRes = await fetch('/api/profile/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ avatarUrl: newAvatarUrl }),
            });

            if (patchRes.ok) {
                alert('Avatar updated successfully! 🎉');
                fetchProfile(); // Перезагружаем данные, чтобы увидеть результат
            } else {
                alert('Failed to update profile link');
            }
        } catch (error) {
            console.error('Error during avatar upload sequence', error);
            alert('Something went wrong');
        }
    };

    if (loading) return <div className="p-10">Loading profile...</div>;
    if (!profile) return <div className="p-10">Profile not found.</div>;

    return (
        <div className="max-w-lg">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>

            <div className="border p-6 rounded-lg bg-white shadow-sm flex flex-col items-center gap-4">
                {/* АВАТАРКА */}
                <div className="relative">
                    {/* Если есть url, показываем картинку, иначе серый круг */}
                    {profile.avatarUrl ? (
                        <img
                            src={profile.avatarUrl}
                            alt="Avatar"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl">
                            ?
                        </div>
                    )}
                </div>

                {/* КНОПКА ЗАГРУЗКИ (input type=file) */}
                <div className="flex flex-col items-center">
                    <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700 transition">
                        Change Photo 📸
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </label>
                </div>

                {/* ИНФОРМАЦИЯ */}
                <div className="text-center w-full mt-4 border-t pt-4">
                    <h2 className="text-xl font-bold">{profile.displayName}</h2>
                    <p className="text-gray-500">@{profile.username}</p>
                    {profile.bio && (
                        <p className="mt-2 text-gray-700 italic">
                            {profile.bio}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

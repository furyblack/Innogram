'use client'; // 👈 Обязательно, т.к. есть интерактив (onClick)
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NavBar() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Вызываем бэк, чтобы очистить HTTP-only cookie
            await fetch('/api/auth/logout', { method: 'POST' });
            // Редирект на логин
            router.push('/auth');
            router.refresh(); // Обновляем состояние приложения
        } catch (e) {
            console.error('Logout failed', e);
        }
    };

    return (
        <nav className="mb-5 p-4 bg-white shadow rounded flex gap-5 items-center border border-gray-300 flex-wrap">
            <b className="text-xl text-black">📸 Innogram</b>

            <Link
                href="/auth"
                className="text-blue-700 font-medium hover:underline"
            >
                Auth
            </Link>
            <Link
                href="/profile"
                className="text-blue-700 font-medium hover:underline"
            >
                Profile
            </Link>
            <Link
                href="/profile/edit"
                className="text-blue-700 font-medium hover:underline"
            >
                Edit
            </Link>
            <Link
                href="/feed"
                className="text-blue-700 font-medium hover:underline"
            >
                Feed
            </Link>
            <Link
                href="/posts/my"
                className="text-blue-600 font-medium hover:underline"
            >
                My Posts
            </Link>
            <Link
                href="/explore"
                className="text-blue-700 font-medium hover:underline"
            >
                Explore
            </Link>
            <Link
                href="/search"
                className="text-blue-700 font-medium hover:underline"
            >
                Search
            </Link>
            <Link
                href="/requests"
                className="text-blue-600 font-medium hover:underline"
            >
                Requests
            </Link>

            {/* 🔥 Кнопка Logout */}
            <button
                onClick={handleLogout}
                className="text-red-600 font-bold hover:text-red-800 ml-auto border border-red-200 px-3 py-1 rounded hover:bg-red-50"
            >
                Logout 🚪
            </button>
        </nav>
    );
}

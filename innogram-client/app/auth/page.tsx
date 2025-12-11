'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    // 1. Старая функция Логина (без изменений)
    const handleLogin = async () => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            alert('✅ Success! Cookies are set.');
            router.push('/feed');
        } else {
            alert('❌ Error logging in');
        }
    };

    // 2. ✨ НОВАЯ функция для проверки Refresh Token
    const handleRefresh = async () => {
        try {
            // Мы просто шлем POST запрос. Куки (refresh_token) браузер прикрепит сам!
            const res = await fetch('/api/auth/refresh', {
                method: 'POST',
            });

            if (res.ok) {
                const data = await res.json();
                console.log('Refresh response:', data);
                alert('✅ Token Refreshed! Session extended.');
            } else {
                alert(
                    '❌ Refresh Failed (Token expired or invalid). Please login again.'
                );
            }
        } catch (e) {
            console.error(e);
            alert('Network Error');
        }
    };

    return (
        <div className="flex flex-col gap-4 max-w-sm">
            <h1 className="text-2xl font-bold">Sign In</h1>

            {/* Поля ввода */}
            <input
                className="border border-gray-400 p-2 rounded text-black placeholder-gray-600"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="border border-gray-400 p-2 rounded text-black placeholder-gray-600"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {/* Кнопка Логина */}
            <button
                onClick={handleLogin}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
                Login
            </button>

            {/* 👇 НОВАЯ СЕКЦИЯ С КНОПКОЙ REFRESH */}
            <div className="mt-6 pt-4 border-t border-gray-300">
                <p className="text-sm text-gray-500 mb-2">Debug Actions:</p>
                <button
                    onClick={handleRefresh}
                    className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 font-medium"
                >
                    🔄 Test Refresh Token
                </button>
            </div>
        </div>
    );
}

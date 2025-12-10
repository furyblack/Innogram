'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        // ВАЖНО: Мы стучимся на /api/auth, а Next сам перешлет на бэкенд
        const res = await fetch("/api/auth/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            alert('✅ Success! Cookies are set.');
            router.push('/feed'); // Перенаправляем в ленту
        } else {
            alert('❌ Error logging in');
        }
    };

    return (
        <div className="flex flex-col gap-4 max-w-sm">
            <h1 className="text-2xl font-bold">Sign In</h1>
            <input
                className="border p-2 rounded"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="border p-2 rounded"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={handleLogin}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
                Login
            </button>
        </div>
    );
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
    // Переключатель: Вход или Регистрация
    const [isRegister, setIsRegister] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Доп. поля для регистрации
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [birthday, setBirthday] = useState('2000-01-01'); // Дефолтная дата

    const router = useRouter();

    const handleSubmit = async () => {
        // Выбираем URL в зависимости от режима
        const endpoint = isRegister ? '/api/auth/signup' : '/api/auth/login';

        // Формируем тело запроса
        const body = isRegister
            ? { email, password, username, display_name: displayName, birthday }
            : { email, password };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                credentials: 'include',
            });

            if (res.ok) {
                alert(
                    isRegister
                        ? '✅ Registered! Welcome.'
                        : '✅ Login successful!',
                );
                router.push('/feed');
            } else {
                const err = await res.json();
                alert(`❌ Error: ${err.message || err.error}`);
            }
        } catch (e) {
            console.error(e);
            alert('Network Error');
        }
    };

    // ... (функция handleRefresh остается та же) ...
    const handleRefresh = async () => {
        /* твой код рефреша */
    };

    return (
        <div className="flex flex-col gap-4 max-w-sm mx-auto mt-10 p-6 border rounded shadow-md bg-white">
            <h1 className="text-2xl font-bold text-center text-black">
                {isRegister ? 'Create Account' : 'Sign In'}
            </h1>

            {/* Поля для Регистрации */}
            {isRegister && (
                <>
                    <input
                        className="border border-gray-400 p-2 rounded text-black"
                        placeholder="Username (e.g. batman)"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="border border-gray-400 p-2 rounded text-black"
                        placeholder="Display Name (e.g. Bruce Wayne)"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                    <label className="text-xs text-gray-600 ml-1">
                        Birthday
                    </label>
                    <input
                        className="border border-gray-400 p-2 rounded text-black"
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                    />
                </>
            )}

            {/* Общие поля */}
            <input
                className="border border-gray-400 p-2 rounded text-black"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="border border-gray-400 p-2 rounded text-black"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {/* Кнопка действия */}
            <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold"
            >
                {isRegister ? 'Sign Up' : 'Login'}
            </button>

            {/* Переключатель */}
            <p className="text-center text-sm text-gray-600 mt-2">
                {isRegister
                    ? 'Already have an account? '
                    : "Don't have an account? "}
                <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-blue-600 font-bold hover:underline"
                >
                    {isRegister ? 'Login here' : 'Register here'}
                </button>
            </p>

            <hr className="my-2" />
            {/* Кнопка рефреша для тестов */}
            {/* ... вставь сюда свою кнопку Refresh ... */}
        </div>
    );
}

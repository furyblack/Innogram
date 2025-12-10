import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
    title: 'Innogram Test UI',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="p-5 font-sans bg-gray-50 text-black">
                {/* Меню навигации */}
                <nav className="mb-5 p-4 bg-white shadow rounded flex gap-5 items-center">
                    <b className="text-xl">📸 Innogram UI</b>
                    <Link
                        href="/auth"
                        className="text-blue-600 hover:underline"
                    >
                        Auth
                    </Link>
                    <Link
                        href="/profile"
                        className="text-blue-600 hover:underline"
                    >
                        Profile
                    </Link>
                    <Link
                        href="/feed"
                        className="text-blue-600 hover:underline"
                    >
                        Feed
                    </Link>
                </nav>

                {/* Контент страницы */}
                <main className="bg-white p-5 rounded shadow min-h-[500px]">
                    {children}
                </main>
            </body>
        </html>
    );
}

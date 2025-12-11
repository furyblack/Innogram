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
            {/* text-gray-900 (почти черный) вместо дефолтного */}
            <body className="p-5 font-sans bg-gray-100 text-gray-900">
                {/* Меню: bg-white, текст темный */}
                <nav className="mb-5 p-4 bg-white shadow rounded flex gap-5 items-center border border-gray-300">
                    <b className="text-xl text-black">📸 Innogram UI</b>
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
                        href="/feed"
                        className="text-blue-700 font-medium hover:underline"
                    >
                        Feed
                    </Link>
                </nav>

                <main className="bg-white p-5 rounded shadow min-h-[500px] border border-gray-300">
                    {children}
                </main>
            </body>
        </html>
    );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import NavBar from './components/NavBar';

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
            <body className="p-5 font-sans bg-gray-100 text-gray-900">
                {/* 👇 Вставляем компонент меню */}
                <NavBar />

                <main className="bg-white p-5 rounded shadow min-h-[500px] border border-gray-300">
                    {children}
                </main>
            </body>
        </html>
    );
}

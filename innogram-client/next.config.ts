import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                // ВАЖНО: Мы шлем ВСЕ запросы (и auth, и posts) в Core Service (3001).
                // Core Service сам разберется, кого вызывать внутри.
                source: '/api/:path*',
                destination: 'http://localhost:3001/api/:path*',
            },
        ];
    },
};

export default nextConfig;

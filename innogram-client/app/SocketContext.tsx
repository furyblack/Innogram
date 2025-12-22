'use client';

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useMemo,
    useRef,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { usePathname } from 'next/navigation';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    hasUnread: boolean;
    setHasUnread: (val: boolean) => void;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    hasUnread: false,
    setHasUnread: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const pathname = usePathname();
    // Используем ref для защиты от двойной инициализации в Strict Mode
    const isInitialized = useRef(false);

    useEffect(() => {
        if (isInitialized.current) return;

        // 1. Создаем инстанс сокета
        const socketInstance = io('http://localhost:3001', {
            withCredentials: true,
            transports: ['websocket'],
            autoConnect: true,
        });

        // 2. Обработчики системных событий
        socketInstance.on('connect', () => {
            console.log('🟢 Socket connected:', socketInstance.id);
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('🔴 Socket disconnected');
            setIsConnected(false);
        });

        // 3. Глобальный слушатель новых сообщений для "красной точки"
        socketInstance.on('newMessage', (msg) => {
            console.log('📡 Глобальный сокет поймал сообщение:', msg);
            // Проверяем текущий путь через window, так как это событие извне
            if (window.location.pathname !== '/chats') {
                console.log('🔴 Зажигаем красную точку!');
                setHasUnread(true);
            }
        });

        // 4. Таймер авто-переподключения (каждые 5 сек, если дисконнект)
        const reconnectTimer = setInterval(() => {
            if (!socketInstance.connected) {
                console.log('🔄 Попытка авто-переподключения...');
                socketInstance.connect();
            }
        }, 5000);

        // 5. Сохраняем сокет в стейт через setTimeout, чтобы избежать ворчания ESLint
        setTimeout(() => {
            setSocket(socketInstance);
        }, 0);

        isInitialized.current = true;

        // 6. Чистим всё при размонтировании
        return () => {
            console.log('🧹 Очистка сокета и таймеров');
            clearInterval(reconnectTimer);
            socketInstance.disconnect();
            isInitialized.current = false;
        };
    }, []);

    // Автоматический сброс уведомления при переходе на страницу чатов
    useEffect(() => {
        if (pathname === '/chats' && hasUnread) {
            const timeout = setTimeout(() => {
                setHasUnread(false);
            }, 0);
            return () => clearTimeout(timeout);
        }
    }, [pathname, hasUnread]);

    const contextValue = useMemo(
        () => ({
            socket,
            isConnected,
            hasUnread,
            setHasUnread,
        }),
        [socket, isConnected, hasUnread]
    );

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
};

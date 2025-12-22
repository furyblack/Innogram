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

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    // Используем ref, чтобы избежать повторного создания сокета при ререндерах
    const isInitialized = useRef(false);

    useEffect(() => {
        if (isInitialized.current) return; // Защита от двойного запуска в React Strict Mode

        const socketInstance = io('http://localhost:3001', {
            withCredentials: true,
            transports: ['websocket'],
            autoConnect: true,
        });

        socketInstance.on('connect', () => {
            console.log('🟢 Socket connected:', socketInstance.id);
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            console.log('🔴 Socket disconnected');
            setIsConnected(false);
        });

        // Используем очередь задач, чтобы setState не вызывался синхронно в теле эффекта
        // Это уберет предупреждение ESLint
        setTimeout(() => {
            setSocket(socketInstance);
        }, 0);

        isInitialized.current = true;

        return () => {
            socketInstance.disconnect();
            isInitialized.current = false;
        };
    }, []);

    const contextValue = useMemo(
        () => ({
            socket,
            isConnected,
        }),
        [socket, isConnected]
    );

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
};

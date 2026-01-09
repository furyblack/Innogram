'use client';

import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../SocketContext';
import { Chat, ChatMessage } from '../types';

export default function ChatsPage() {
    const { socket, isConnected } = useSocket();

    // Состояния с четкими типами
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [myProfileId, setMyProfileId] = useState<string | null>(null);
    const [inputText, setInputText] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Получаем свой профиль, чтобы знать свой ID
    useEffect(() => {
        fetch('/api/profile/me')
            .then((res) => res.json())
            .then((data) => setMyProfileId(data.id));
    }, []);

    // 2. Загружаем список чатов
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await fetch('/api/chats');
                if (res.ok) {
                    const data: Chat[] = await res.json();
                    setChats(data);
                }
            } catch (err) {
                console.error('Failed to fetch chats', err);
            }
        };
        fetchChats();
    }, []);

    // 3. Сокет-слушатель
    useEffect(() => {
        if (!socket) return;

        socket.on('newMessage', (message: ChatMessage) => {
            if (activeChat && message.chatId === activeChat.id) {
                setMessages((prev) => [...prev, message]);
            }
            // Можно добавить логику уведомления в списке чатов
        });

        return () => {
            socket.off('newMessage');
        };
    }, [socket, activeChat]);

    const handleSelectChat = (chat: Chat) => {
        setActiveChat(chat);
        setMessages(chat.messages || []);
        socket?.emit('joinRoom', { chatId: chat.id });
    };

    const handleSendMessage = () => {
        if (!socket || !inputText.trim() || !activeChat) return;
        socket.emit('sendMessage', {
            chatId: activeChat.id,
            content: inputText,
        });
        setInputText('');
    };

    // Хелпер для получения имени собеседника
    const getChatName = (chat: Chat) => {
        // 1. Проверка на группу
        if (chat.type === 'group') return chat.name || 'Group Chat';

        // 2. Безопасная проверка: если участников нет (еще не загрузились), вернем заглушку
        if (!chat.participants) return 'Loading...';

        // 3. Ищем собеседника (того, чей ID не совпадает с моим)
        const otherParticipant = chat.participants.find(
            (p) => p.profileId !== myProfileId
        );

        return (
            otherParticipant?.profile.displayName ||
            otherParticipant?.profile.username ||
            'Private Chat'
        );
    };

    return (
        <div className="flex h-[70vh] bg-white rounded-lg shadow-lg border border-gray-300 overflow-hidden text-black">
            {/* Список чатов */}
            <aside className="w-1/3 border-r border-gray-300 bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-300 bg-white font-bold text-lg">
                    Messages
                    <span
                        className={`ml-2 inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                    />
                </div>
                <div className="overflow-y-auto">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => handleSelectChat(chat)}
                            className={`p-4 cursor-pointer hover:bg-gray-100 border-b border-gray-200 ${activeChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}
                        >
                            <p className="font-semibold">{getChatName(chat)}</p>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Окно сообщений */}
            <main className="flex-1 flex flex-col">
                {activeChat ? (
                    <>
                        <header className="p-4 border-b border-gray-300 font-bold bg-white">
                            {getChatName(activeChat)}
                        </header>

                        <div className="flex-1 p-4 overflow-y-auto bg-gray-100 space-y-3">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.profileId === myProfileId ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`p-3 rounded-xl max-w-[70%] ${
                                            msg.profileId === myProfileId
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white border border-gray-300'
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <footer className="p-4 border-t border-gray-300 flex gap-2">
                            <input
                                className="flex-1 border border-gray-400 p-2 rounded-lg px-4"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handleSendMessage()
                                }
                                placeholder="Type a message..."
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Send
                            </button>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Select a chat to start
                    </div>
                )}
            </main>
        </div>
    );
}

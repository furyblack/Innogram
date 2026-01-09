// Описываем профиль (вложен в автора)
export interface Profile {
    username: string;
    displayName: string;
    avatarUrl?: string;
    bio?: string;
    id?: string;
}

// Описываем Автора (юзера)
export interface Author {
    id: string;
    email?: string;
    profile?: Profile;
}

// Описываем Комментарий
export interface Comment {
    id: string;
    content: string;
    author: Author;
    createdAt?: string;
}

// Описываем Пост
export interface Post {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    likesCount: number;
    profile: Profile;
    createdAt?: string;
}

// Описываем Юзера (для списка юзеров)
export interface User {
    id: string;
    email: string;
    profile?: Profile;
}

export interface ChatMessage {
    id: string;
    content: string;
    profileId: string;
    chatId: string;
    createdAt: string;
    profile?: Profile; // Опционально, если бэк решит прислать данные автора
}

export interface ChatParticipant {
    id: string;
    profileId: string;
    chatId: string;
    isAdmin: boolean;
    joinedAt: string;
    profile: Profile; // Используем твой существующий интерфейс Profile
}

export enum ChatType {
    PRIVATE = 'private',
    GROUP = 'group',
}

export interface Chat {
    id: string;
    type: ChatType;
    name?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    participants: ChatParticipant[];
    messages: ChatMessage[];
}

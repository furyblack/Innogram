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

export interface SocialLoginDto {
    email: string;
    username: string; // Сгенерируем в Core или тут
    displayName: string;
    provider: 'google' | 'github';
    providerId: string; // Google ID
    avatarUrl?: string;
}

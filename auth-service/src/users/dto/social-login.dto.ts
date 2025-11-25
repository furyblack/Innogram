export interface SocialLoginDto {
    email: string;
    username: string;
    displayName: string;
    provider: 'google' | 'github';
    providerId: string; 
    avatarUrl?: string;
}

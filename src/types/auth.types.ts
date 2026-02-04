
export type UserRoles = 'admin' | 'tutor' | 'student';

export interface SessionUser {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    bio: string;
    image: string;
    role: UserRoles;
    phone: number | string | null;
    status: string;
    banReason?: string | null;
    bannedAt?: Date;
    createdAt: Date;
    lastLoginAt: Date | null;
    updatedAt: Date;
}
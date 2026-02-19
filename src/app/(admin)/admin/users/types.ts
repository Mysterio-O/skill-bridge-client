export type UsersMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};

export type AdminUserDTO = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;

    role?: string | null;
    phone?: string | null;
    status?: string | null;

    bio?: string | null;
    lastLoginAt?: string | null;

    bannedAt?: string | null;
    banReason?: string | null;

    createdAt?: string | null;
    updatedAt?: string | null;
};

export type GetUsersParams = {
    search?: string;
    page?: number;
    limit?: number;
};

export type GetUsersResult = {
    meta: UsersMeta;
    users: AdminUserDTO[];
};

export type UpdateUserStatusPayload = {
    userId: string;
    status: "active" | "banned";
    banReason?: string;
};

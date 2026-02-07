export type Category = {
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    isActive?: boolean;
};

export type MeResponse = {
    success: boolean;
    user?: {
        id: string;
        name: string;
        email: string;
        role: "student" | "tutor" | "admin";
    };
    message?: string;
};

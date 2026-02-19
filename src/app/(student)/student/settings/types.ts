export type StudentProfileDTO = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;

    role?: string | null;
    phone?: string | null;
    status?: string | null;
    bio?: string | null;

    createdAt?: string | null;
    updatedAt?: string | null;
    lastLoginAt?: string | null;
};

export type UpdateStudentProfilePayload = Partial<
    Pick<StudentProfileDTO, "name" | "phone" | "bio" | "image">
>;

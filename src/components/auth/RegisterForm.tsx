"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

const schema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters.").max(60).trim(),
    email: z.string().email("Enter a valid email.").trim().toLowerCase(),
    password: z.string().min(6, "Password must be at least 6 characters."),
    image: z
        .any()
        .optional()
        .refine(
            (file) => !file || file instanceof File,
            "Invalid file."
        )
        .refine(
            (file) => !file || file.size <= MAX_IMAGE_SIZE,
            "Image must be 2MB or less."
        )
        .refine(
            (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
            "Only JPG, PNG, WEBP are allowed."
        ),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterForm() {

    const { signUpWithEmail } = useAuth()

    const router = useRouter();
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", email: "", password: "", image: undefined },
        mode: "onTouched",
    });

    const { register, setValue, handleSubmit, formState, watch } = form;
    const { errors, isSubmitting } = formState;

    const currentImage = watch("image");

    React.useEffect(() => {
        if (!currentImage || !(currentImage instanceof File)) {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(currentImage);
        setPreviewUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentImage]);

    function pickImage() {
        fileInputRef.current?.click();
    }

    function removeImage() {
        setValue("image", undefined, { shouldValidate: true, shouldDirty: true });
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast({ title: "Image removed" });
    };

    async function uploadToImgbb(file: File) {
        const fd = new FormData();
        fd.append("file", file);

        const res = await fetch("/api/upload/imgbb", {
            method: "POST",
            body: fd,
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data?.message || "Image upload failed");
        }

        // prefer `url` (direct). fallback to displayUrl.
        return (data.url || data.displayUrl) as string;
    }


    async function onSubmit(values: FormValues) {
        try {
            const callbackURL = new URL("/redirect", window.location.origin).toString();

            let imageUrl: string | undefined = undefined;

            // 1) Upload to ImgBB (if image picked)
            if (values.image instanceof File) {
                imageUrl = await uploadToImgbb(values.image);
            }

            // 2) Signup with Better Auth using image URL (string)
            const res = await signUpWithEmail({
                name: values.name,
                email: values.email,
                password: values.password,
                image: imageUrl,
                callbackURL,
            });

            if (!res.ok) {
                toast({
                    variant: "destructive",
                    title: "Registration failed",
                    description: res?.message || "Please check your details and try again.",
                });
                return;
            }

            toast({
                title: "Account created!",
                description: "You're ready to signin with your new account",
            });

            // optional:
            router.replace("/login");
        } catch (e) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: (e instanceof Error) ? e?.message : "Please try again.",
            });
        }
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            {/* Image picker (optional) */}
            <div className="grid gap-2">
                <Label>Profile image (optional)</Label>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        setValue("image", file ?? undefined, {
                            shouldValidate: true,
                            shouldDirty: true,
                        });
                    }}
                />

                <div
                    className={cn(
                        "group relative flex items-center gap-4 rounded-2xl border bg-background/60 p-4",
                        "transition-colors hover:bg-muted/40"
                    )}
                >
                    <div className="relative h-16 w-16 overflow-hidden rounded-2xl border bg-muted">
                        {previewUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="grid h-full w-full place-items-center text-muted-foreground">
                                <ImagePlus className="h-5 w-5" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <p className="text-sm font-medium">
                            {previewUrl ? "Image selected" : "Upload a profile image"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            JPG/PNG/WEBP • up to 2MB
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button type="button" variant="secondary" onClick={pickImage}>
                            {previewUrl ? "Change" : "Choose"}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={removeImage}
                            disabled={!previewUrl}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Remove image"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {errors.image ? (
                    <p className="text-sm text-destructive">{String(errors.image.message)}</p>
                ) : null}
            </div>

            {/* Name */}
            <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" placeholder="Your name" autoComplete="name" {...register("name")} />
                {errors.name ? (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                ) : null}
            </div>

            {/* Email */}
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="you@example.com" autoComplete="email" {...register("email")} />
                {errors.email ? (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                ) : null}
            </div>

            {/* Password */}
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete="new-password" {...register("password")} />
                {errors.password ? (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                ) : null}
            </div>

            <Button type="submit" disabled={isSubmitting} className="mt-1">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create account
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-foreground underline-offset-4 hover:underline">
                    Sign in
                </Link>
            </p>
        </form>
    );
}

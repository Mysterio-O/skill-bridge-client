"use client";

import React, { useMemo, useState, useTransition } from "react";
import type { StudentProfileDTO } from "../types";
import { updateStudentProfileAction } from "../actions";

import { toast } from "@/components/ui/use-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import ReadonlyField from "./readonly-field";

function initials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(" ").filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (a + b).toUpperCase();
}

export default function StudentProfileForm({
  profile,
  from
}: {
  profile: StudentProfileDTO;
  from?:string;
}) {
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState(profile.name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [image, setImage] = useState(profile.image ?? "");

  const changed = useMemo(() => {
    return (
      name.trim() !== (profile.name ?? "").trim() ||
      (phone ?? "").trim() !== (profile.phone ?? "").trim() ||
      (bio ?? "").trim() !== (profile.bio ?? "").trim() ||
      (image ?? "").trim() !== (profile.image ?? "").trim()
    );
  }, [name, phone, bio, image, profile]);

  function onReset() {
    setName(profile.name ?? "");
    setPhone(profile.phone ?? "");
    setBio(profile.bio ?? "");
    setImage(profile.image ?? "");
  }

  function onSave() {
    if (!name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your full name before saving.",
        variant: "destructive",
      });
      return;
    }

    const payload: Record<string, any> = {};

    if (name.trim() !== (profile.name ?? "").trim()) payload.name = name.trim();

    if ((phone ?? "").trim() !== (profile.phone ?? "").trim()) {
      payload.phone = phone.trim() ? phone.trim() : ""; // empty clears
    }

    if ((bio ?? "").trim() !== (profile.bio ?? "").trim()) {
      payload.bio = bio.trim() ? bio.trim() : ""; // empty clears
    }

    if ((image ?? "").trim() !== (profile.image ?? "").trim()) {
      payload.image = image.trim() ? image.trim() : ""; // empty clears
    }

    if (Object.keys(payload).length === 0) {
      toast({
        title: "No changes detected",
        description: "Update something first, then click save.",
      });
      return;
    }

    startTransition(async () => {
      const loading = toast({
        title: "Saving changes...",
        description: "Updating your profile. Please wait.",
      });

      try {
        await updateStudentProfileAction(payload);

        loading.dismiss();
        toast({
          title: "Profile updated",
          description: "Your changes have been saved successfully.",
        });
      } catch (e) {
        loading.dismiss();
        toast({
          title: "Update failed",
          description: e instanceof Error ? e.message : "Something went wrong.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Left: editable form */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={image || profile.image || ""} alt={profile.name} />
              <AvatarFallback>{initials(profile.name)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium leading-none">
                {profile.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {profile.email}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input
                value={phone ?? ""}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880..."
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to remove phone.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Profile image URL</label>
            <Input
              value={image ?? ""}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
            />
            <p className="text-xs text-muted-foreground">
              Paste an image URL (upload flow can be added later).
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={bio ?? ""}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about you..."
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty to clear bio.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" disabled={pending} onClick={onReset}>
              Reset
            </Button>

            <Button type="button" disabled={pending || !changed} onClick={onSave}>
              {pending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right: read-only info */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <ReadonlyField label="Email" value={profile.email} />
          <ReadonlyField
            label="Email verified"
            value={profile.emailVerified ? "Yes" : "No"}
          />
          <ReadonlyField label="Role" value={profile.role ?? "student"} />
          <ReadonlyField label="Status" value={profile.status ?? "active"} />

          <Separator />

          <ReadonlyField label="User ID" value={profile.id} />
          <ReadonlyField label="Last login" value={profile.lastLoginAt ?? "—"} />
          <ReadonlyField label="Created" value={profile.createdAt ?? "—"} />
        </CardContent>
      </Card>
    </div>
  );
}

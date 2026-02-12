"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";

import type { TutorProfileDTO } from "../types";
import { getTutorProfileAction } from "../actions";

import AvailabilityToggleCard from "./AvailabilityToggleCard";
import TutorProfileForm from "./TutorProfileForm";

export default function TutorSettingsClient() {
  const [loading, setLoading] = React.useState(true);
  const [profile, setProfile] = React.useState<TutorProfileDTO | null>(null);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      const tutor = await getTutorProfileAction();
      console.log(tutor);
      setProfile(tutor);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load profile";
      toast({ variant: "destructive", title: "Error", description: msg });
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Tutor Settings
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Update your profile and availability.
          </p>
        </div>

        {profile ? (
          <AvailabilityToggleCard
            availability={profile.availability}
            onChanged={(availability) =>
              setProfile((prev) => (prev ? { ...prev, availability } : prev))
            }
          />
        ) : null}
      </div>

      <Separator className="bg-slate-200/60 dark:bg-slate-800/60" />

      {profile ? (
        <TutorProfileForm
          profile={profile}
          onSaved={(next) => setProfile(next)}
        />
      ) : (
        <div className="text-sm text-slate-600 dark:text-slate-400">
          No profile data found.
        </div>
      )}
    </div>
  );
}

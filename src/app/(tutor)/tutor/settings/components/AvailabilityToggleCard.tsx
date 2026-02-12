"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import type { TutorAvailability } from "../types";
import { updateAvailabilityAction } from "../actions";

export default function AvailabilityToggleCard({
  availability,
  onChanged,
}: {
  availability: TutorAvailability;
  onChanged: (availability: TutorAvailability) => void;
}) {
  const [saving, setSaving] = React.useState(false);

  const isAvailable = availability === "available";

  const handleToggle = async (checked: boolean) => {
    const next: TutorAvailability = checked ? "available" : "not_available";
    const prev: TutorAvailability = isAvailable ? "available" : "not_available";

    // optimistic update
    onChanged(next);

    try {
      setSaving(true);
      await updateAvailabilityAction(next);
      toast({
        title: "Availability updated",
        description: checked
          ? "You are now marked as available."
          : "You are now marked as not available.",
      });
    } catch (e) {
      // rollback
      onChanged(prev);
      const msg = e instanceof Error ? e.message : "Failed to update availability";
      toast({ variant: "destructive", title: "Error", description: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/40">
      <div className="flex flex-col">
        {/* <div className="text-xs text-slate-600 dark:text-slate-400">Status</div> */}
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-full border-slate-300/70 text-slate-800 dark:border-slate-700/80 dark:text-slate-200"
          >
            {isAvailable ? "Available" : "Not available"}
          </Badge>
          {saving ? <Loader2 className="h-4 w-4 animate-spin text-slate-500" /> : null}
        </div>
      </div>

      <Switch
        checked={isAvailable}
        onCheckedChange={handleToggle}
        disabled={saving}
        className="data-[state=checked]:bg-emerald-600"
      />
    </div>
  );
}

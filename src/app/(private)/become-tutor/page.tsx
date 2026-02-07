import Link from "next/link";
import BackgroundGlow from "@/components/shared/BackgroundGlow";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BecomeTutorForm from "./components/BecomeTutorForm";


export const dynamic = "force-dynamic";

export default function BecomeTutorPage() {
  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-background">
      <BackgroundGlow />

      <div className="relative mx-auto max-w-6xl px-4 py-10">
        <Card className="rounded-3xl border bg-card/55 backdrop-blur p-6">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold text-foreground">Become a Tutor</h1>
                <Badge variant="outline" className="rounded-2xl">
                  Application
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Fill in your tutor profile. After submission, it will wait for admin approval.
              </p>
            </div>

            <div className="shrink-0">
              <Button asChild variant="secondary" className="rounded-2xl">
                <Link href="/">Back</Link>
              </Button>
            </div>
          </div>

          <Separator className="my-5" />

          {/* Form */}
          <BecomeTutorForm />
        </Card>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          Tip: Choose subjects you’re strongest in and write a clear teaching style in “About”.
        </div>
      </div>
    </div>
  );
}

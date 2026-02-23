import { Suspense } from "react";
import RedirectClient from "./redirect-client";

export const dynamic = "force-dynamic"; // optional but recommended for auth pages

export default function RedirectPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next =
    typeof searchParams?.next === "string" ? searchParams.next : undefined;

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-sm text-muted-foreground">
            Checking your session...
          </div>
        </div>
      }
    >
      <RedirectClient next={next} />
    </Suspense>
  );
}
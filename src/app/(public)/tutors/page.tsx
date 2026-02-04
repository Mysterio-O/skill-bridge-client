import { Suspense } from "react";
import TutorsClient from "./components/TutorsClient";

export default async function TutorsPage({
  searchParams,
}: {
  searchParams?: { search?: string };
}) {
  const search = typeof searchParams?.search === "string" ? searchParams.search : "";

  const qs = new URLSearchParams();
  qs.set("page", "1");
  qs.set("limit", "10");
  if (search) qs.set("search", search);


  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/tutors?${qs.toString()}`, {
    cache: "no-store",
  }).catch(() => null);

  const initial = res ? await res.json() : null;

  return (
    <Suspense fallback={''}>
      <TutorsClient initial={initial} initialSearch={search} />
    </Suspense>
  );
}

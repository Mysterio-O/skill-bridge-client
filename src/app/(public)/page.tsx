import React from "react";
import HomeClient from "@/components/marketing/HomeClient";
import type { Tutor } from "@/components/marketing/TutorsSection";
import type { Review } from "@/components/marketing/ReviewsSection";

export default async function HomePage() {


  const reviews: Review[] = [
    {
      id: 1,
      name: "Samiul",
      title: "Student",
      rating: 5,
      text:
        "The sessions were structured and practical. I improved fast and finally felt confident building projects end to end.",
    },
    {
      id: 2,
      name: "Nabila",
      title: "Parent",
      rating: 4.8,
      text:
        "Great communication and clear progress tracking. My child improved consistency and performance within a few weeks.",
    },
    {
      id: 3,
      name: "Rifat",
      title: "Student",
      rating: 4.9,
      text:
        "Excellent feedback on mistakes and a clear learning path. Booking and follow-ups were smooth and professional.",
    },
  ];


  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/tutors?$page=1&limit=3`, {
    cache: "no-store",
  }).catch(() => null);

  const tutors = await res?.json()


  return <HomeClient tutors={tutors.data.tutors} reviews={reviews} />;
}

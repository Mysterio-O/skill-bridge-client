import React from "react";
import HomeClient from "@/components/marketing/HomeClient";
import type { Tutor } from "@/components/marketing/TutorsSection";
import type { Review } from "@/components/marketing/ReviewsSection";

export default function HomePage() {
  const tutors: Tutor[] = [
    {
      id: 1,
      name: "Ayesha Rahman",
      title: "Full-Stack Engineer",
      subjects: ["Next.js", "React", "Node.js", "System Design"],
      rating: 4.9,
      reviewsCount: 128,
      hourlyRate: 18,
      location: "Remote",
      verified: true,
    },
    {
      id: 2,
      name: "Tanvir Hasan",
      title: "Math & Physics Tutor",
      subjects: ["Algebra", "Calculus", "Physics", "Exam prep"],
      rating: 4.8,
      reviewsCount: 96,
      hourlyRate: 12,
      location: "Remote",
      verified: true,
    },
    {
      id: 3,
      name: "Nusrat Jahan",
      title: "English & IELTS Coach",
      subjects: ["IELTS", "Speaking", "Writing", "Grammar"],
      rating: 4.9,
      reviewsCount: 141,
      hourlyRate: 15,
      location: "Remote",
      verified: true,
    },
  ];

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

  return <HomeClient tutors={tutors} reviews={reviews} />;
}

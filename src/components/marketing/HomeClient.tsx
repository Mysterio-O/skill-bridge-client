"use client";

import React from "react";
import { useRouter } from "next/navigation";

import HeroBanner from "@/components/marketing/HeroBanner";
import TutorsSection, { Tutor } from "@/components/marketing/TutorsSection";
import ReviewsSection, { Review } from "@/components/marketing/ReviewsSection";
import Footer from "../shared/Footer";

type HomeClientProps = {
    tutors: Tutor[];
    reviews: Review[];
};

export default function HomeClient({ tutors, reviews }: HomeClientProps) {
    const router = useRouter();

    return (
        <main>
            <HeroBanner
                onSearch={(q) => {
                    const query = q.trim();
                    if (!query) return;
                    router.push(`/tutors?search=${encodeURIComponent(query)}`);
                }}
            />

            <TutorsSection
                tutors={tutors}
                onCategoryClick={(c) => {
                    router.push(`/tutors?category=${encodeURIComponent(c)}`);
                }}
            />

            <ReviewsSection reviews={reviews} />

            <Footer />
        </main>
    );
}

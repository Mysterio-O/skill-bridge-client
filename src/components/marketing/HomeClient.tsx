"use client";

import React from "react";
import { useRouter } from "next/navigation";

import HeroBanner from "@/components/marketing/HeroBanner";
import TutorsSection from "@/components/marketing/TutorsSection";
import ReviewsSection, { Review } from "@/components/marketing/ReviewsSection";
import Footer from "../shared/Footer";
import { TutorProfile } from "@/app/actions/tutorActions/getTutors";
import HomeExtraSections from "../home/HomeExtraSections";

type HomeClientProps = {
    reviews: Review[];
};


async function fetchTutors() {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/tutors?$page=1&limit=3`, {
        cache: "no-store",
    }).catch(() => null);

    const tutors = await res?.json() || [];
    return tutors.data.tutors as TutorProfile[];
}


export default function HomeClient({ reviews }: HomeClientProps) {
    const router = useRouter();

    const [tutors, setTutors] = React.useState<TutorProfile[]>([]);

    React.useEffect(() => {
        fetchTutors().then(setTutors);
    }, []);

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
                tutors={tutors ?? []}
                onCategoryClick={(c) => {
                    router.push(`/tutors?category=${encodeURIComponent(c)}`);
                }}
            />

            <ReviewsSection reviews={reviews} />

            <HomeExtraSections />

            <Footer />
        </main>
    );
}

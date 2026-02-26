'use client';

import React from 'react'
import { toast } from '../ui/use-toast';
import { buildAuthHeader } from '@/lib/auth/token';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '../ui/button';
import Link from 'next/link';
import ScheduleBookingSheet from '../tutors/ScheduleBookingSheet';
import { TutorProfile } from '@/app/actions/tutorActions/getTutors';




type CreateBookingPayload = {
    tutorProfileId: string;

    startAt: string;
    endAt: string;
    timezone?: string;
    durationMinutes: number;

    topic?: string;
    meetingLink?: string;
};


export default function ScheduleBookingButton({tutor}:{tutor:TutorProfile}) {

    const { user } = useAuth();

    const [openBooking, setOpenBooking] = React.useState(false);

    const handleSubmitBooking = React.useCallback(async (payload: CreateBookingPayload) => {
        const t = toast({
            title: "Scheduling booking...",
            description: "Please wait a moment.",
        });

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json", ...buildAuthHeader() },
                body: JSON.stringify(payload),
            });
            console.log(res);

            const json = await res.json();

            console.log(json);

            if (!res.ok || !json?.success) {
                throw new Error(json?.message || "Failed to create booking");
            }

            t.update({
                title: "Booking scheduled",
                description: "Your booking has been created successfully.",
            });

            // close sheet
            setOpenBooking(false);
        } catch (e) {
            t.update({
                title: "Booking failed",
                description: (e instanceof Error) ? e?.message : "Something went wrong",
                variant: "destructive",
            });
            throw e;
        }
    }, []);

    return (
        <>
            {user ? (
                <Button className="rounded-2xl" onClick={() => setOpenBooking(true)}>
                    Schedule booking
                </Button>
            ) : (
                <Button className="rounded-2xl" asChild>
                    <Link href="/login">Signin to schedule</Link>
                </Button>
            )}

            <ScheduleBookingSheet
                open={openBooking}
                onOpenChange={setOpenBooking}
                tutor={tutor}
                onSubmit={handleSubmitBooking}
            />

        </>
    )
}

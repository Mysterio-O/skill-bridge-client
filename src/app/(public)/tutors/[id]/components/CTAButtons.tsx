'use client'

import { TutorProfile } from '@/app/actions/tutorActions/getTutors'
import ScheduleBookingButton from '@/components/shared/ScheduleBookingButton'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function CTAButtons({ tutor }: { tutor: TutorProfile }) {


    return (
        <div className="mt-3 flex gap-2 sm:justify-end">
            <ScheduleBookingButton tutor={tutor} />

            <Button variant="outline" className="rounded-2xl" asChild>
                <Link href="/tutors">Back</Link>
            </Button>
        </div>
    )
}

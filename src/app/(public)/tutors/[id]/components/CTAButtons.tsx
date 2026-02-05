'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/AuthProvider'
import Link from 'next/link'
import React from 'react'

export default function CTAButtons({ id }: { id: string }) {

    const { user } = useAuth();

    return (
        <div className="mt-3 flex gap-2 sm:justify-end">
            {
                user && <Button className="rounded-2xl" asChild>
                    <Link href={`/bookings/new?tutorId=${encodeURIComponent(id)}`}>
                        Schedule booking
                    </Link>
                </Button>
            }

            <Button variant="outline" className="rounded-2xl" asChild>
                <Link href="/tutors">Back</Link>
            </Button>
        </div>
    )
}

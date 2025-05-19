'use client'

import React from 'react'
import Link from 'next/link'
import {useUser} from '@/context/userContext'

export default function ProfileUserButton() {
    const {userID} = useUser()

    return (
        <Link
            href={`/profile/${userID}`}
            className="inline-block bg-black text-white text-sm font-medium px-4 py-2 rounded-3xl  hover:border-lime-400 hover:text-lime-400 transition-colors"
            aria-label="Перейти на профиль"
            title="Профиль"
        >
            Назад
        </Link>
    )
}

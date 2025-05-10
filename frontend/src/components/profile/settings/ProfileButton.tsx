'use client'

import React from 'react';
import Link from "next/link";
import {useUser} from "@/context/userContext";

export default function ProfileButton() {
    const {userID} = useUser()
    return (
        <Link
            href={`/profile/${userID}`}
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-3xl transition"
            aria-label="Перейти на главную"
            title="Домой"
        >
            Назад
        </Link>
    );
};
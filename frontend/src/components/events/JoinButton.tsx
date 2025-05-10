'use client'

import React, {useState} from 'react';

export default function JoinButton() {
    const [isJoined, setIsJoined] = useState<boolean>(false)

    return (
        <button
            onClick={() => setIsJoined(!isJoined)}
            className={`min-w-[120px] p-2 rounded-3xl hover:cursor-pointer ${isJoined ? 'bg-gray-50 text-emerald-600 border border-emerald-600' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
        >
            {isJoined ? 'Вы идёте' : 'Учавствовать'}
        </button>
    );
};
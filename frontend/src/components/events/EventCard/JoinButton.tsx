'use client'

import React, {useState} from 'react';
import toast from 'react-hot-toast';
import {joinEvent, leaveEvent} from "@/lib/api/apiEvents";

export default function JoinButton({isJoined, id}: { isJoined: boolean, id: string }) {

    const [isJoin, setIsJoin] = useState<boolean>(isJoined)

    async function handleJoin() {
        if (isJoin) {
            if (await leaveEvent(id)) {
                toast.success('Вы больше не участвуете в мероприятии')
                setIsJoin(false)
            } else {
                toast.error('Ошибка. Попробуйте выйти позже')
            }
        } else {
            if (await joinEvent(id)) {
                toast.success('Теперь вы участвуете в мероприятии')
                setIsJoin(true)
            } else {
                toast.error('Ошибка. Попробуйте присоединится позже')
            }
        }
    }

    return (
        <button
            onClick={handleJoin}
            className={`min-w-[120px] p-2 rounded-3xl hover:cursor-pointer ${isJoin ? 'bg-gray-50 text-emerald-600 border border-emerald-600' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
        >
            {isJoin ? 'Вы идёте' : 'Участвовать'}
        </button>
    );
};
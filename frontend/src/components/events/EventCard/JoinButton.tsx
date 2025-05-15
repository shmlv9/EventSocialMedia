'use client'

import React, {useState} from 'react';
import toast from 'react-hot-toast';
import {joinEvent, leaveEvent} from "@/lib/api/apiEvents";

export default function JoinButton({isJoined, id}: { isJoined: boolean, id: string }) {
    const [isJoin, setIsJoin] = useState<boolean>(isJoined);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function handleJoin() {
        setIsLoading(true);
        try {
            if (isJoin) {
                if (await leaveEvent(id)) {
                    toast.success('Вы больше не участвуете в мероприятии');
                    setIsJoin(false);
                } else {
                    toast.error('Ошибка. Попробуйте выйти позже');
                }
            } else {
                if (await joinEvent(id)) {
                    toast.success('Теперь вы участвуете в мероприятии');
                    setIsJoin(true);
                } else {
                    toast.error('Ошибка. Попробуйте присоединиться позже');
                }
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <button
            onClick={handleJoin}
            disabled={isLoading}
            className={`min-w-[120px] p-2 rounded-3xl font-medium transition-colors duration-200 ${
                isJoin 
                    ? 'bg-neutral-800 text-lime-400 border border-lime-400 hover:bg-neutral-700' 
                    : 'bg-lime-400 text-black hover:bg-lime-300'
            } ${isLoading ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            {isLoading ? 'Загрузка...' : isJoin ? 'Вы идёте ✓' : 'Участвовать'}
        </button>
    );
}
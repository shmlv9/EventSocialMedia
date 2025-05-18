'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { joinEvent, leaveEvent } from "@/lib/api/events/apiEvents"
import { FiCheck, FiPlus } from 'react-icons/fi'

export default function JoinButton({ isJoined, id }: { isJoined: boolean, id: string }) {
    const [isJoin, setIsJoin] = useState<boolean>(isJoined)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function handleJoin() {
        setIsLoading(true)
        try {
            if (isJoin) {
                const success = await leaveEvent(id)
                if (success) {
                    toast.success('Вы больше не участвуете', {
                        icon: '👋',
                        style: {
                            borderRadius: '12px',
                            background: '#333',
                            color: '#fff',
                        },
                    })
                    setIsJoin(false)
                } else {
                    throw new Error()
                }
            } else {
                const success = await joinEvent(id)
                if (success) {
                    toast.success('Вы участвуете в мероприятии!', {
                        icon: '🎉',
                        style: {
                            borderRadius: '12px',
                            background: '#333',
                            color: '#fff',
                        },
                    })
                    setIsJoin(true)
                } else {
                    throw new Error()
                }
            }
        } catch (error) {
            toast.error(isJoin ? 'Не удалось выйти' : 'Не удалось присоединиться', {
                style: {
                    borderRadius: '12px',
                    background: '#333',
                    color: '#fff',
                },
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleJoin}
            disabled={isLoading}
            className={`
                min-w-[140px] px-4 py-3 rounded-3xl font-medium 
                transition-all duration-200 flex items-center justify-center gap-2
                ${
                    isJoin
                        ? 'bg-lime-400/10 text-lime-500 border-2 border-lime-400 hover:bg-lime-400/20'
                        : 'bg-lime-400 text-black hover:bg-lime-500 shadow-md hover:shadow-lg'
                }
                ${
                    isLoading 
                        ? 'opacity-70 cursor-not-allowed' 
                        : 'cursor-pointer transform hover:scale-[1.02]'
                }
            `}
            aria-label={isJoin ? 'Покинуть мероприятие' : 'Присоединиться к мероприятию'}
        >
            {isLoading ? (
                <span className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full"></span>
            ) : (
                <>
                    {isJoin ? <FiCheck size={18} /> : <FiPlus size={18} />}
                    {isJoin ? 'Вы участвуете' : 'Участвовать'}
                </>
            )}
        </button>
    )
}
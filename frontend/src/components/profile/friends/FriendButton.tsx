'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaUserPlus, FaCheck, FaClock } from 'react-icons/fa';
import { acceptRequest, rejectRequest } from "@/lib/api/users/apiFriends";

type Props = {
    id: string;
    apiUrl: string;
    token: string;
    status: string;
};

export default function FriendButton({ id, apiUrl, token, status }: Props) {
    const [buttonState, setButtonState] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    async function handleAdd() {
        if (buttonState) {
            toast.success('Вы уже отправили заявку');
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`${apiUrl}/user/friends/requests/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success('Заявка отправлена');
                setButtonState(true);
            } else {
                toast.error('Ошибка при добавлении');
            }
        } catch (e) {
            toast.error('Ошибка запроса');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleReject() {
        if (buttonState) {
            toast.success("Вы уже ответили на заявку");
            return;
        }
        setLoading(true);
        await rejectRequest(id);
        setButtonState(true);
        setLoading(false);
        toast.success('Заявка отклонена');
    }

    async function handleAccept() {
        if (buttonState) {
            toast.success("Вы уже ответили на заявку");
            return;
        }
        setLoading(true);
        await acceptRequest(id);
        setButtonState(true);
        setLoading(false);
        toast.success('Заявка принята');
    }

    return (
        <>
            {status === 'in_friends' && (
                <button
                    disabled
                    className="flex items-center gap-2 bg-neutral-800 p-2 rounded-2xl text-white cursor-not-allowed"
                >
                    <FaCheck className="text-lime-500" />
                    В друзьях
                </button>
            )}

            {status === 'not_in_friends' && (
                <button
                    onClick={handleAdd}
                    disabled={loading || buttonState}
                    className={`flex items-center gap-2 p-2 rounded-2xl text-white border ${
                        buttonState
                            ? 'bg-neutral-800 cursor-not-allowed'
                            : 'bg-lime-500 border-lime-500 text-black hover:bg-lime-400 transition'
                    }`}
                >
                    <FaUserPlus />
                    {loading ? 'Отправка...' : buttonState ? 'Заявка отправлена' : 'Добавить в друзья'}
                </button>
            )}

            {status === 'application_sent' && (
                <button
                    disabled
                    className="flex items-center gap-2 bg-neutral-800 p-2 rounded-2xl text-white cursor-not-allowed"
                >
                    <FaClock className="text-pink-400" />
                    Заявка отправлена
                </button>
            )}

            {status === 'application_received' && (
                <div className="flex gap-2">
                    <button
                        onClick={handleAccept}
                        disabled={loading}
                        className="flex items-center gap-2 bg-lime-500 p-2 rounded-2xl text-black border border-lime-500 hover:bg-lime-400 transition"
                    >
                        Принять
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={loading}
                        className="flex items-center gap-2 bg-neutral-800 p-2 rounded-2xl text-white 0 hover:bg-neutral-700 transition"
                    >
                        Отклонить
                    </button>
                </div>
            )}
        </>
    );
}
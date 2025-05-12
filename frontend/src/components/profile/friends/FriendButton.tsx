'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaUserPlus, FaCheck, FaClock } from 'react-icons/fa';
import { acceptRequest, rejectRequest } from "@/lib/api/apiFriends";

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
                    className="flex items-center gap-2 bg-emerald-600 p-2 rounded-2xl text-white opacity-80 cursor-not-allowed"
                >
                    <FaCheck />
                    В друзьях
                </button>
            )}

            {status === 'not_in_friends' && (
                <button
                    onClick={handleAdd}
                    disabled={loading}
                    className={`flex items-center gap-2 p-2 rounded-2xl text-white ${
                        buttonState
                            ? 'bg-gray-400 opacity-80 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 transition'
                    }`}
                >
                    <FaUserPlus />
                    {loading ? 'Отправка...' : buttonState ? 'Заявка отправлена' : 'Добавить в друзья'}
                </button>
            )}

            {status === 'application_sent' && (
                <button
                    disabled
                    className="flex items-center gap-2 bg-gray-400 p-2 rounded-2xl text-white opacity-80 cursor-not-allowed"
                >
                    <FaClock />
                    Заявка отправлена
                </button>
            )}

            {status === 'application_received' && (
                <div className="flex gap-2">
                    <button
                        onClick={handleAccept}
                        disabled={loading}
                        className="bg-emerald-600 p-2 rounded-2xl text-white"
                    >
                        Принять
                    </button>
                    <button
                        onClick={handleReject}
                        disabled={loading}
                        className="bg-rose-700 p-2 rounded-2xl text-white"
                    >
                        Отклонить
                    </button>
                </div>
            )}
        </>
    );
}

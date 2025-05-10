'use client'

import React from 'react';
import toast from 'react-hot-toast';

type Props = {
    id: string;
    apiUrl: string;
    token: string;
}

export default function FriendButton({id, apiUrl, token}: Props) {
    async function handleAdd() {
        try {
            const response = await fetch(`${apiUrl}/user/friends/requests/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
            })
            if (response.ok) {
                toast.success('Заявка отправлена')
            } else {
                toast.error('Ошибка')
            }
        } catch (e) {
            toast.error('Ошибка')
            console.log(e)
        }
    }

    return (
        <button className={'bg-emerald-600 p-2 rounded-xl text-white'} onClick={handleAdd}>Добавить в
            друзья</button>
    );
};
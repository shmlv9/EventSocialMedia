'use client'

import React, { useState } from 'react';
import { FiUserX } from 'react-icons/fi';
import {leaveGroup} from "@/lib/api/groups/apiGroup";
import toast from 'react-hot-toast';

export default function LeaveButtonProfile({id}: {id: string}) {

    const [isLeft, setIsLeft] = useState<boolean>(false)

    async function handleDeleteGroup() {
        try {
            const response = await leaveGroup(id)
            if (response) {
                toast.success("Вы успешно вышли из группы")
                setIsLeft(true)
            } else {
                toast.error('Что-то пошло не так попробуйте позже')
            }
        } catch (e) {
            toast.error('Что-то пошло не так попробуйте позже')
        }
    }

    return (
        <button
            onClick={handleDeleteGroup}
            disabled={isLeft}
            className="text-pink-500 hover:text-pink-600 flex items-center text-sm transition cursor-pointer"
        >
            <FiUserX className="mr-1"/>
            {isLeft ? <></> : 'Выйти'}
        </button>
    );
};